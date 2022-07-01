import { createTransport } from "nodemailer";

class MailService {
  async send(email, subject, body) {
    try {
      const transporter = createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 587,
        secure: true,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      return await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject,
        html: body,
      });
    } catch (error) {
      return null;
    }
  }
}

export default new MailService();
