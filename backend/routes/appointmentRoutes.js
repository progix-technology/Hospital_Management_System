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
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Booking calendar availability check
router.get('/booked-slots', getBookedSlots);

// Public or Registered: Create appointment (public users can book without immediate login)
router.post('/', createAppointment);

// Protected: Admin only routes
router.get('/', protect, authorize('admin'), getAllAppointments);
router.get('/admin/dashboard', protect, authorize('admin'), getAdminDashboardStats);
router.delete('/:id', protect, authorize('admin'), deleteAppointment);

// Protected: Doctor & Admin routes
router.get('/doctor/:id/dashboard', protect, authorize('doctor', 'admin'), getDoctorDashboardStats);
router.get('/doctor/:id', protect, authorize('doctor', 'admin'), getDoctorAppointments);

// Protected: Status update (Doctor, Admin)
router.put('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);

// Protected: Patient appointment history (Patient, Doctor, Admin)
router.get('/patient/:id', protect, getPatientAppointments);

export default router;
