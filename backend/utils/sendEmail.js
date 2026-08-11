import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Transporter configuration with fallback
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'elisha.kassulke52@ethereal.email', // Fallback Ethereal User
        pass: process.env.SMTP_PASS || 'Gryh8uUuVvM8gspxP8', // Fallback Ethereal Password
      },
    });

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Medisphere Hospital'}" <${process.env.SMTP_FROM_EMAIL || 'no-reply@medisphere.com'}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
    
    // If using Ethereal, output the preview URL
    if (process.env.SMTP_HOST === 'smtp.ethereal.email' || !process.env.SMTP_HOST) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};
