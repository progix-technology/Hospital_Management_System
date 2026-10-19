import generateToken from '../utils/generateToken.js';
import { findUserByEmail, getModelByRole } from '../utils/getUserModel.js';
import Otp from '../models/Otp.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Send 6-digit OTP to user email for registration verification via SMTP
// @route   POST /api/auth/send-register-otp
// @access  Public
export const sendRegisterOtp = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // 1. Check if user already exists
    const { user: userExists } = await findUserByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists. Please log in.' 
      });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Clear any previous unverified OTPs and store the new one
    await Otp.deleteMany({ email: normalizedEmail });
    await Otp.create({
      email: normalizedEmail,
      otp,
      verified: false
    });

    // 4. Send Email via Nodemailer SMTP
    const emailSubject = `${otp} is your Medisphere Registration Code`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0f6c4f; margin: 0; font-size: 24px; font-weight: 800;">Medisphere Hospital</h1>
          <p style="color: #64748b; margin: 4px 0 0; font-size: 13px;">Care, Integrity, Innovation</p>
        </div>

        <div style="background: linear-gradient(135deg, #0f6c4f 0%, #15803d 100%); padding: 20px; border-radius: 12px; text-align: center; color: #ffffff; margin-bottom: 24px;">
          <h2 style="margin: 0 0 6px; font-size: 18px; font-weight: 700;">Email Verification Code</h2>
          <p style="margin: 0; font-size: 13px; opacity: 0.9;">Please enter this OTP to complete your patient registration.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f6c4f; background: #ecfdf5; padding: 14px 28px; border-radius: 12px; border: 2px dashed #059669;">
            ${otp}
          </div>
          <p style="margin-top: 12px; font-size: 12px; color: #64748b;">
            This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
          If you did not initiate this registration request, you can safely ignore this email.<br />
          &copy; ${new Date().getFullYear()} Medisphere Healthcare Systems. All rights reserved.
        </div>
      </div>
    `;

    await sendEmail({
      to: normalizedEmail,
      subject: emailSubject,
      html: emailHtml,
      text: `Your Medisphere registration OTP is: ${otp}. It is valid for 10 minutes.`
    });

    res.json({
      success: true,
      message: 'Verification OTP has been sent to your email.'
    });
  } catch (error) {
    console.error('Error sending register OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP email. Please verify your email address and try again.' 
    });
  }
};

// @desc    Verify 6-digit OTP for email
// @route   POST /api/auth/verify-register-otp
// @access  Public
export const verifyRegisterOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Please provide both email and OTP code.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const enteredOtp = otp.toString().trim();

  try {
    const record = await Otp.findOne({ 
      email: normalizedEmail, 
      otp: enteredOtp 
    });

    if (!record) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP. Please check the code or request a new one.' 
      });
    }

    record.verified = true;
    await record.save();

    res.json({
      success: true,
      message: 'Email verified successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, role } = await findUserByEmail(email);

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role || user.role,
        specialty: user.specialty,
        department: user.department,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user (Enforces Verified Email OTP)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role, dateOfBirth, gender, bloodGroup, phone, emergencyContact, address, specialty, department } = req.body;

  try {
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be created via public registration' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Enforce verified email via OTP
    const verifiedOtp = await Otp.findOne({ email: normalizedEmail, verified: true });
    if (!verifiedOtp) {
      return res.status(400).json({ 
        message: 'Email is not verified. Please request and verify the OTP sent to your email.' 
      });
    }

    // 2. Check if user already exists
    const { user: userExists } = await findUserByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address.' });
    }

    const TargetModel = getModelByRole(role || 'patient');

    const user = await TargetModel.create({
      name,
      email: normalizedEmail,
      password,
      role: role || 'patient',
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      emergencyContact,
      address,
      specialty,
      department
    });

    if (user) {
      // Clear OTP record now that user is registered
      await Otp.deleteMany({ email: normalizedEmail });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialty: user.specialty,
        department: user.department,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get currently logged-in user profile from JWT
// @route   GET /api/auth/me
// @access  Private (JWT Protected)
export const getMe = async (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

