import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as mysql from 'mysql2/promise';

@Injectable()
export class BackupService {
    private readonly logger = new Logger(BackupService.name);
    private readonly excludedTables = ['users'];

    @Cron('0 0 0,6,12,18 * * *')
    async handleCron() {
        this.logger.debug('Starting database backup...');
        try {
            const sourceConnection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            });

            const targetConnection = await mysql.createConnection({
                host: process.env.BACKUP_DB_HOST,
                user: process.env.BACKUP_DB_USERNAME,
                password: process.env.BACKUP_DB_PASSWORD,
                database: process.env.BACKUP_DB_NAME,
            });

            const [sourceTables] = await sourceConnection.query('SHOW TABLES');
            const sourceTableNames = (sourceTables as mysql.RowDataPacket[]).map((row) => Object.values(row)[0] as string);

            const [backupTables] = await targetConnection.query('SHOW TABLES');
            const backupTableNames = (backupTables as mysql.RowDataPacket[]).map((row) => Object.values(row)[0] as string);

            const newTables = sourceTableNames.filter(table => !backupTableNames.includes(table) && !this.excludedTables.includes(table));

            for (const table of newTables) {
                this.logger.debug(`Creating missing table: ${table}`);
                
                const [createTableStatement] = await sourceConnection.query(`SHOW CREATE TABLE \`${table}\``);
                const createTableSql = (createTableStatement as mysql.RowDataPacket[])[0]['Create Table'] as string;

                await targetConnection.query(createTableSql);
            }

            for (const table of sourceTableNames) {
                if (this.excludedTables.includes(table)) {
                    this.logger.debug(`Skipping table: ${table}`);
                    continue;
                }

                this.logger.debug(`Backing up table: ${table}`);

                const [targetColumns] = await targetConnection.query(`SHOW COLUMNS FROM \`${table}\``);
                const targetColumnNames = (targetColumns as mysql.RowDataPacket[]).map((col) => col.Field as string);

                const [rows] = await sourceConnection.query(`SELECT * FROM \`${table}\``);

                await targetConnection.query(`DELETE FROM \`${table}\``);

                for (const row of rows as mysql.RowDataPacket[]) {
                    try {
                        const filteredRow = Object.keys(row).reduce((acc, key) => {
                            if (targetColumnNames.includes(key)) {
                                acc[key] = row[key];
                            }
                            return acc;
                        }, {} as any);

                        await targetConnection.query(`INSERT INTO \`${table}\` SET ?`, filteredRow);
                    } catch (error) {
                        this.logger.error(`Failed to insert row into table ${table}:`, error);
                    }
                }
            }

            await sourceConnection.end();
            await targetConnection.end();

            this.logger.debug('Database backup completed successfully.');
        } catch (error) {
            this.logger.error('Failed to backup database:', error);
        }
    }
}