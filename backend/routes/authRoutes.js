import express from 'express';
import { 
  loginUser, 
  registerUser, 
  getMe, 
  sendRegisterOtp, 
  verifyRegisterOtp 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-register-otp', sendRegisterOtp);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
