import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailTemplate } from './mail-template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ahmad.fadillah0210@gmail.com',
        pass: 'vuth ftjy xomj ftde',
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"OK OCE" okoce@gmail.com',
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
    }
  }

  async sendTemplateMail(to: string, subject: string, title: string, body: string, actionUrl: string, actionText: string): Promise<void> {
    try {
      const html = await emailTemplate(title, body, actionUrl, actionText);
      await this.sendMail(to, subject, html);
    } catch (error) {
      this.logger.error(`Failed to send template email to ${to}`, error.stack);
    }
  }

  async sendMultipleEmails(emails: { to: string; subject: string; html: string }[]): Promise<void> {
    const emailTasks = emails.map(({ to, subject, html }) => this.sendMail(to, subject, html));
    await Promise.all(emailTasks);
  }
}


