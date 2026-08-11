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

const router = express.Router();

router.get('/patients', getPatients);
router.get('/patients/:id', getPatientById);
router.put('/patients/:id/vitals', updatePatientVitals);
router.post('/patients/:id/lab-payment', recordLabPayment);
router.get('/profile/:id', getPatientProfile);
router.put('/profile/:id', updateUserProfile);
router.delete('/:id', deleteUser);
router.get('/doctors', getDoctors);
router.get('/technicians', getTechnicians);

export default router;
