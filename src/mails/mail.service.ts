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
        pass: 'gsmx ulzx ulde xpih', 
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
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

  async sendTemplateMail(to: string, subject: string, title: string, body: string, actionUrl: string, actionText: string) {
    const html = await emailTemplate(title, body, actionUrl, actionText);
    await this.sendMail(to, subject, html);
  }
}
