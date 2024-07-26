import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as mysql from 'mysql2/promise';

@Injectable()
export class BackupService {
    private readonly logger = new Logger(BackupService.name);
    
    @Cron('0 0 * * *')  // cron job untuk berjalan setiap hari pada tengah malam
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
            
            const [tables] = await sourceConnection.query('SHOW TABLES');
            const tableNames = (tables as any[]).map((row: any) => Object.values(row)[0]);

            for (const table of tableNames) {
                this.logger.debug(`Backing up table: ${table}`);

                // Ambil data dari tabel database sumber
                const [rows] = await sourceConnection.query(`SELECT * FROM ${table}`);

                // Hapus data lama dari tabel di database backup
                await targetConnection.query(`DELETE FROM ${table}`);

                // Masukkan data baru ke tabel di database bakcup
                for (const row of rows as any[]) {
                    await targetConnection.query(`INSERT INTO ${table} SET ?`, row);
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