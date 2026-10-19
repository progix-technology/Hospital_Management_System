import express from 'express';
import { 
  getPatients, 
  getPatientById, 
  getDoctors, 
  getTechnicians, 
  updatePatientVitals, 
  getPatientProfile, 
  updateUserProfile, 
  deleteUser,
  recordLabPayment
} from '../controllers/userController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Directories (For public website & appointments)
router.get('/doctors', getDoctors);
router.get('/technicians', getTechnicians);

// Protected User Routes (Require valid JWT Bearer Token)
router.get('/patients', protect, authorize('admin', 'doctor', 'lab_technician'), getPatients);
router.get('/patients/:id', protect, getPatientById);
router.put('/patients/:id/vitals', protect, authorize('doctor', 'admin'), updatePatientVitals);
router.post('/patients/:id/lab-payment', protect, authorize('lab_technician', 'admin'), recordLabPayment);
router.get('/profile/:id', protect, getPatientProfile);
router.put('/profile/:id', protect, updateUserProfile);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
