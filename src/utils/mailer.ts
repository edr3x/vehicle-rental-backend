import { createTransport } from "nodemailer";
import env from "../config/env";

const transporter = createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
    },
});

export async function sendVerificationEmail({
    toEmail,
    code,
    subject,
}: {
    toEmail: string;
    code: string;
    subject: string;
}) {
    const link = `http://localhost:3000/verifymail?code=${code}&email=${toEmail}`;
    await transporter.sendMail({
        from: "noreply@vehiclerental.com.np",
        to: toEmail,
        subject: subject,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h2 style="color: #333333; text-align: center;">Vehicle Rental Application</h2>
          <p style="color: #333333; margin-bottom: 20px;">Dear Customer,</p>
          <p style="color: #333333; margin-bottom: 10px;">Thank you for registering with our vehicle rental service. Please verify your email by clicking on the button below:</p>
          <a href="${link}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-right: 10px;">Verify</a>
          <p style="color: #333333; margin-top: 20px;">Once your email is verified, you will be able to access your account and start renting vehicles.</p>
          <p style="color: #333333; margin-top: 20px;">If you have any questions or concerns, please do not hesitate to contact us.</p>
          <p style="color: #333333; margin-top: 20px;">Best regards,<br>The Vehicle Rental Team</p>
        </div>
        `,
    });
}
