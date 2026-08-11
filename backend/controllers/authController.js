import generateToken from '../utils/generateToken.js';
import { findUserByEmail, getModelByRole } from '../utils/getUserModel.js';

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

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role, dateOfBirth, gender, bloodGroup, phone, emergencyContact, address, specialty, department } = req.body;

  try {
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be created via public registration' });
    }

    const { user: userExists } = await findUserByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const TargetModel = getModelByRole(role || 'patient');

    const user = await TargetModel.create({
      name,
      email,
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
