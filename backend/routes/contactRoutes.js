import express from 'express';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

// @desc    Send contact form message via SMTP
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  try {
    const fullName = `${firstName} ${lastName || ''}`.trim();
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'info@progixtechnology.com';

    // Email content for the Hospital Support/Admin
    const adminEmailSubject = `New Contact Form Query: ${subject || 'General Inquiry'}`;
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0f6c4f; border-bottom: 2px solid #0f6c4f; padding-bottom: 10px; margin-top: 0;">New Contact Inquiry Received</h2>
        <p>A new message has been submitted via the Medisphere Contact Form:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; width: 30%;">Full Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone Number:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Subject Category:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-transform: capitalize;">${subject}</td>
          </tr>
        </table>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #0f6c4f;">
          <h4 style="margin: 0 0 10px 0; color: #0f6c4f;">Message Content:</h4>
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="font-size: 11px; color: #999; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
          This inquiry was sent automatically from Medisphere CMS. Please respond directly to the sender.
        </p>
      </div>
    `;

    // Email content for the User (Auto-confirmation)
    const userEmailSubject = `We have received your message - Medisphere Hospital`;
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center;">
          <h1 style="color: #0f6c4f; margin-bottom: 5px;">Medisphere Hospital</h1>
          <p style="font-size: 13px; color: #888; margin-top: 0;">Care, Integrity, Innovation</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Thank you for reaching out to us. We have received your inquiry regarding <strong>"${subject || 'General Inquiry'}"</strong>.</p>
        <p>Our patient relationship coordinators and clinical staff are reviewing your query, and we will get back to you within 24 business hours.</p>
        
        <div style="background: #f0f9f5; border: 1px solid #d1fae5; padding: 15px; border-radius: 8px; margin: 25px 0;">
          <h4 style="color: #065f46; margin: 0 0 8px 0;">Need immediate medical assistance?</h4>
          <p style="margin: 0; font-size: 13px;">If you have a medical emergency, please do not wait for an email response. Contact our 24/7 Priority Emergency Helpline directly at <strong>+91 89532 08952</strong>.</p>
        </div>

        <p>Best Regards,</p>
        <p style="margin-bottom: 0;"><strong>Patient Care Division</strong></p>
        <p style="margin-top: 0; font-size: 13px; color: #666;">Medisphere Group of Hospitals</p>
      </div>
    `;

    // Send email to Admin/Receiver
    await sendEmail({
      to: receiverEmail,
      subject: adminEmailSubject,
      html: adminEmailHtml,
      text: `New contact form submission from ${fullName}. Email: ${email}. Phone: ${phone}. Subject: ${subject}. Message: ${message}`
    });

    // Send auto-acknowledgement to User
    await sendEmail({
      to: email,
      subject: userEmailSubject,
      html: userEmailHtml,
      text: `Hello ${fullName}, we have received your contact inquiry about "${subject}". Our team will reply within 24 hours.`
    });

    res.status(200).json({ success: true, message: 'Message sent successfully via SMTP!' });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message via SMTP server. Please try again later.' });
  }
});

export default router;
