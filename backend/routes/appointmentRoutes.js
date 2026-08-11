import express from 'express';
import { 
  getDoctorDashboardStats, 
  getAdminDashboardStats,
  getDoctorAppointments, 
  getPatientAppointments,
  createAppointment,
  updateAppointmentStatus,
  getAllAppointments,
  deleteAppointment,
  getBookedSlots
} from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/', getAllAppointments);
router.get('/booked-slots', getBookedSlots);
router.get('/admin/dashboard', getAdminDashboardStats);
router.get('/doctor/:id/dashboard', getDoctorDashboardStats);
router.get('/doctor/:id', getDoctorAppointments);
router.get('/patient/:id', getPatientAppointments);
router.post('/', createAppointment);
router.put('/:id/status', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

export default router;
