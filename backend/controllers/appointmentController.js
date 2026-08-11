import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import LabTechnician from '../models/LabTechnician.js';

// @desc    Get doctor dashboard stats
// @route   GET /api/appointments/doctor/:id/dashboard
// @access  Public
export const getDoctorDashboardStats = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Get all patients count
    const totalPatients = await Patient.countDocuments({});

    // Get today's start and end date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's appointments
    const todaysAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: today, $lt: tomorrow }
    }).populate('patient', 'name age gender clinicalRecord');

    const totalTodaysAppointments = todaysAppointments.length;
    const completedConsultations = todaysAppointments.filter(app => app.status === 'Completed').length;
    const pendingReports = 3; 

    // Get recent activity (last 5 appointments booked or updated)
    const recentActivity = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      totalPatients,
      todaysAppointments: totalTodaysAppointments,
      completedConsultations,
      pendingReports,
      schedule: todaysAppointments,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/appointments/admin/dashboard
// @access  Public
export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments({});
    const totalDoctors = await Doctor.countDocuments({});
    const totalTechs = await LabTechnician.countDocuments({});
    const totalAppointments = await Appointment.countDocuments({});

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysAppointmentsCount = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    const pendingAppointmentsCount = await Appointment.countDocuments({
      status: { $in: ['Scheduled', 'In Progress'] }
    });

    const completedAppointmentsCount = await Appointment.countDocuments({
      status: 'Completed'
    });

    // Calculate revenue from all appointments
    const appointments = await Appointment.find({});
    const totalRevenue = appointments.reduce((sum, app) => sum + (Number(app.fee) || 500), 0);

    // Recent registered patients
    const recentPatients = await Patient.find({})
      .select('name createdAt email phone gender')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent appointments
    const recentAppointments = await Appointment.find({})
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialty')
      .sort({ createdAt: -1 })
      .limit(6);

    // Group revenue/patients by month (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[key] = { name: monthNames[d.getMonth()], revenue: 0, appointments: 0 };
    }

    appointments.forEach(app => {
      const appDate = app.date ? new Date(app.date) : (app.createdAt ? new Date(app.createdAt) : new Date());
      const key = `${monthNames[appDate.getMonth()]} ${appDate.getFullYear()}`;
      if (monthlyMap[key]) {
        monthlyMap[key].revenue += (Number(app.fee) || 500);
        monthlyMap[key].appointments += 1;
      }
    });

    const monthlyData = Object.values(monthlyMap);

    res.json({
      totalPatients,
      totalDoctors,
      totalTechs,
      totalAppointments,
      todaysAppointmentsCount,
      pendingAppointmentsCount,
      completedAppointmentsCount,
      totalRevenue,
      monthlyData,
      recentPatients,
      recentAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments for a doctor
// @route   GET /api/appointments/doctor/:id
// @access  Public
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.id })
      .populate('patient', 'name email phone bloodGroup')
      .sort({ date: 1, timeSlot: 1 });
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments for a patient
// @route   GET /api/appointments/patient/:id
// @access  Public
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate('doctor', 'name email specialty')
      .sort({ date: -1, timeSlot: 1 });
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booked time slots for a doctor on a specific date
// @route   GET /api/appointments/booked-slots
// @access  Public
export const getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!date) {
      return res.json([]);
    }

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23,59,59,999);

    const query = {
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'Cancelled' }
    };
    if (doctorId && doctorId !== 'null' && doctorId !== 'undefined') {
      query.doctor = doctorId;
    }

    const booked = await Appointment.find(query).select('timeSlot');
    const bookedTimeSlots = booked.map(b => b.timeSlot);

    res.json(bookedTimeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, timeSlot, type, fee, paymentMethod } = req.body;

    // Double-booking check for same doctor & date & timeSlot
    if (date && timeSlot) {
      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23,59,59,999);

      const checkQuery = {
        date: { $gte: startOfDay, $lte: endOfDay },
        timeSlot,
        status: { $ne: 'Cancelled' }
      };
      if (doctor) {
        checkQuery.doctor = doctor;
      }

      const existingSlot = await Appointment.findOne(checkQuery);

      if (existingSlot) {
        return res.status(400).json({ 
          message: `The ${timeSlot} slot is already booked for this doctor/department on the selected date. Please choose another time slot.` 
        });
      }
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      date,
      timeSlot,
      type,
      fee,
      paymentMethod
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Public
export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.status = req.body.status || appointment.status;
      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Public
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient', 'name email phone bloodGroup gender')
      .populate('doctor', 'name email specialty phone')
      .sort({ date: -1, createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
      await Appointment.deleteOne({ _id: req.params.id });
      res.json({ message: 'Appointment deleted successfully' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
