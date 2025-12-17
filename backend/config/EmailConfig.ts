import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(
      "Gmail service is not ready to send mail , please check your email configurations"
    );
  } else {
    console.log("Gmail service is ready to send emails");
  }
});

const sendEmail = async (to: string, subject: string, body: string) => {
  await transporter.sendMail({
    from: `"MYSMME"<${process.env.EMAIL_HOST_USER}>`,
    to,
    subject,
    html: body,
  });
};

export const sendVerificationToEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const logoUrl = "./frontend/public/logo.png";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 25px;
        }
        .logo {
          width: 120px;
          margin-bottom: 10px;
        }
        .header h1 {
          color: #333333;
          font-size: 24px;
        }
        .message {
          font-size: 16px;
          color: #444;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          margin-top: 30px;
          padding: 12px 24px;
          font-size: 16px;
          color: #ffffff !important;
          background-color: #4f46e5;
          text-decoration: none;
          border-radius: 6px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${
            logoUrl
              ? `<img src="${logoUrl}" alt="MYSMME Logo" class="logo" />`
              : ""
          }
          <h1>Verify Your Email</h1>
        </div>

        <div class="message">
          <p>Hello,</p>
          <p>
            Thank you for registering with <strong>MYSMME</strong>.
            Please click the button below to verify your email and activate your account.
          </p>

          <a href="${verificationUrl}" class="btn">Verify Email</a>

          <p style="margin-top: 20px;">
            If you didn’t request this, you can safely ignore this email.
          </p>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} MYSMME. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(to, "Please verify your account", html);
};

export const sendResetPasswordLinktoEmail = async (
  to: string,
  token: string,
  name: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          text-align: center; /* Center contents horizontally */
        }
        .header h1 {
          color: #333333;
        }
        .message {
          font-size: 16px;
          color: #444;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          margin: 30px auto 0 auto; /* center horizontally */
          padding: 12px 24px;
          font-size: 16px;
          color: #ffffff !important;
          background-color: #d63384;
          text-decoration: none;
          border-radius: 6px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="message">
        <p>Hi ${name},</p>
        <p>You recently requested to reset your password for your <strong>MYSMME</strong> account. This password reset link is only valid for a limited time. Click the button below to proceed:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" class="btn">Reset Password</a>
        </div>

        <p> If you didn’t request a password reset, you can safely ignore this email.</p>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} MYSSME. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail(to, "Password Reset Request - MYSSME", html);
};
