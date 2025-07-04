import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';
import { ContactRecord } from './ContactService.js';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendContactNotification(contact: Partial<ContactRecord>): Promise<void> {
    try {
      const emailHtml = this.generateContactEmailHtml(contact);
      const emailText = this.generateContactEmailText(contact);

      const mailOptions = {
        from: `"Portfolio Contact Form" <${config.FROM_EMAIL}>`,
        to: config.TO_EMAIL,
        subject: `New Contact: ${contact.subject || 'Portfolio Contact Form'}`,
        text: emailText,
        html: emailHtml,
        replyTo: contact.email,
        messageId: `<contact-${contact.id}@${config.MESSAGE_ID_DOMAIN}>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Contact notification email sent: ${info.messageId}`);

      await this.sendAutoReply(contact);

    } catch (error) {
      logger.error('Failed to send contact notification email:', error);
      throw error;
    }
  }

  async sendReplyEmail(originalMessage: ContactRecord, replyMessage: string): Promise<void> {
    try {
      const replyHtml = this.generateReplyEmailHtml(originalMessage, replyMessage);
      const replyText = this.generateReplyEmailText(originalMessage, replyMessage);

      const mailOptions = {
        from: `"Abdul Wasey" <${config.FROM_EMAIL}>`,
        to: originalMessage.email,
        subject: `Re: ${originalMessage.subject}`,
        text: replyText,
        html: replyHtml,
        inReplyTo: `<contact-${originalMessage.id}@${config.MESSAGE_ID_DOMAIN}>`,
        references: `<contact-${originalMessage.id}@${config.MESSAGE_ID_DOMAIN}>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Reply email sent: ${info.messageId} for contact ID: ${originalMessage.id}`);

    } catch (error) {
      logger.error('Failed to send reply email:', error);
      throw error;
    }
  }

  private async sendAutoReply(contact: Partial<ContactRecord>): Promise<void> {
    try {
      const autoReplyHtml = this.generateAutoReplyHtml(contact);
      const autoReplyText = this.generateAutoReplyText(contact);

      const mailOptions = {
        from: `"Abdul Wasey" <${config.FROM_EMAIL}>`,
        to: contact.email,
        subject: 'Thank you for contacting me!',
        text: autoReplyText,
        html: autoReplyHtml,
        messageId: `<contact-${contact.id}@${config.MESSAGE_ID_DOMAIN}>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Auto-reply email sent: ${info.messageId}`);

    } catch (error) {
      logger.error('Failed to send auto-reply email:', error);
    }
  }

  private generateReplyEmailHtml(originalMessage: ContactRecord, replyMessage: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reply to Contact Form</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .reply { background: #e6f7ff; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea; margin-bottom: 20px; }
          .original { background: #fff; padding: 15px; border-radius: 4px; border-left: 4px solid #764ba2; }
          .signature { margin-top: 30px; font-size: 14px; color: #555; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reply to Your Message</h1>
            <p>This is a reply to your message sent via the portfolio website.</p>
          </div>
          <div class="content">
            <div class="reply">
              ${replyMessage.replace(/\n/g, '<br>')}
            </div>
            <div class="original">
              <strong>Your original message:</strong><br><br>
              <strong>From:</strong> ${originalMessage.name} <${originalMessage.email}><br>
              <strong>Subject:</strong> ${originalMessage.subject}<br>
              <strong>Date:</strong> ${new Date(originalMessage.created_at).toLocaleString()}<br><br>
              ${originalMessage.message.replace(/\n/g, '<br>')}
            </div>
            <div class="signature">
              <p>Best regards,<br>
              <strong>Abdul Wasey</strong><br>
              Associate Network Engineer<br>
              Email: awasey8905@gmail.com<br>
              Phone: +91-7090344713<br>
              Website: <a href="https://w453y.me">w453y.me</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateReplyEmailText(originalMessage: ContactRecord, replyMessage: string): string {
    return `
${replyMessage}

---

Your original message:
From: ${originalMessage.name} <${originalMessage.email}>
Subject: ${originalMessage.subject}
Date: ${new Date(originalMessage.created_at).toLocaleString()}

${originalMessage.message}

---

Best regards,
Abdul Wasey
Associate Network Engineer
Email: awasey8905@gmail.com
Phone: +91-7090344713
Website: https://w453y.me
    `;
  }

  private generateContactEmailHtml(contact: Partial<ContactRecord>): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
          .message { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea; white-space: pre-wrap; }
          .metadata { font-size: 12px; color: #666; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>You have received a new message from your portfolio website.</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${contact.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${contact.email}">${contact.email}</a></div>
            </div>
            ${contact.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value"><a href="tel:${contact.phone}">${contact.phone}</a></div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${contact.subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="message">${contact.message}</div>
            </div>
            <div class="metadata">
              <strong>Submission Details:</strong><br>
              ID: ${contact.id}<br>
              Time: ${new Date(contact.timestamp || '').toLocaleString()}<br>
              IP Address: ${contact.ip_address}<br>
              User Agent: ${contact.user_agent}<br>
              Referrer: ${contact.referrer}<br>
              Website: <a href="https://${config.MESSAGE_ID_DOMAIN}">${config.MESSAGE_ID_DOMAIN}</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateContactEmailText(contact: Partial<ContactRecord>): string {
    return `
New Contact Form Submission

Name: ${contact.name}
Email: ${contact.email}
${contact.phone ? `Phone: ${contact.phone}\n` : ''}Subject: ${contact.subject}
Message: ${contact.message}

Submission Details:
ID: ${contact.id}
Time: ${new Date(contact.timestamp || '').toLocaleString()}
IP Address: ${contact.ip_address}
User Agent: ${contact.user_agent}
Referrer: ${contact.referrer}
Website: https://${config.MESSAGE_ID_DOMAIN}
    `;
  }

  private generateAutoReplyHtml(contact: Partial<ContactRecord>): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting me!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for reaching out!</h1>
          </div>
          <div class="content">
            <p>Hi ${contact.name},</p>
            <p>Thank you for contacting me through my portfolio website. I have received your message and will get back to you as soon as possible, typically within 24 hours.</p>
            <p>Your message:</p>
            <blockquote style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0;">
              ${contact.message}
            </blockquote>
            <p>If you need to reach me urgently, feel free to email me directly at awasey8905@gmail.com or call me at +91-7090344713.</p>
            <p>Best regards,<br>Abdul Wasey</p>
          </div>
          <div class="footer">
            <p>This is an automated response from w453y.me</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAutoReplyText(contact: Partial<ContactRecord>): string {
    return `
Hi ${contact.name},

Thank you for contacting me through my portfolio website. I have received your message and will get back to you as soon as possible, typically within 24 hours.

Your message:
"${contact.message}"

If you need to reach me urgently, feel free to email me directly at awasey8905@gmail.com or call me at +91-7090344713.

Best regards,
Abdul Wasey

---
This is an automated response from w453y.me
    `;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('SMTP connection verified successfully');
      return true;
    } catch (error) {
      logger.error('SMTP connection test failed:', error);
      return false;
    }
  }
}