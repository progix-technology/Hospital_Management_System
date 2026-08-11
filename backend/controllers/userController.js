import 'dotenv/config';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import LabTechnician from '../models/LabTechnician.js';
import Admin from '../models/Admin.js';
import { findUserById } from '../utils/getUserModel.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with env vars & fallbacks
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbp97xecb',
  api_key: process.env.CLOUDINARY_API_KEY || '721126122737375',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'kKznrPHDrBnO8huH3ecyIdfVYpc'
});

// @desc    Get all patients
// @route   GET /api/users/patients
// @access  Public
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all lab technicians
// @route   GET /api/users/technicians
// @access  Public
export const getTechnicians = async (req, res) => {
  try {
    const techs = await LabTechnician.find({}).select('-password');
    res.json(techs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/users/patients/:id
// @access  Public
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password');
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/users/profile/:id
// @access  Public
export const getPatientProfile = async (req, res) => {
  try {
    const { user } = await findUserById(req.params.id);
    if (user) {
      const userObj = user.toObject();
      delete userObj.password;
      res.json(userObj);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient vitals & clinical record
// @route   PUT /api/users/patients/:id/vitals
// @access  Public
export const updatePatientVitals = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      patient.vitals = {
        bloodPressure: req.body.vitals?.bloodPressure || req.body.bloodPressure || patient.vitals.bloodPressure,
        heartRate: req.body.vitals?.heartRate || req.body.heartRate || patient.vitals.heartRate,
        weight: req.body.vitals?.weight || req.body.weight || patient.vitals.weight,
        sugarLevel: req.body.vitals?.sugarLevel || req.body.sugarLevel || patient.vitals.sugarLevel,
        temperature: req.body.vitals?.temperature || req.body.temperature || patient.vitals?.temperature,
        lastUpdated: Date.now()
      };

      let labTests = req.body.clinicalRecord?.labTests || patient.clinicalRecord?.labTests || [];

      // Process Cloudinary PDF uploads if raw base64 data stream present
      const processedLabTests = [];
      for (let test of labTests) {
        if (typeof test === 'string' && test.includes('###PDF_DATA###')) {
          const parts = test.split('###PDF_DATA###');
          const cleanText = parts[0];
          const rawBase64 = parts[1];

          if (rawBase64 && !rawBase64.startsWith('http')) {
            try {
              const result = await cloudinary.uploader.upload(rawBase64, {
                resource_type: 'auto',
                folder: 'medisphere/lab_reports',
                access_mode: 'public',
                flags: 'attachment',
                quality: 'auto:good'
              });
              
              processedLabTests.push(`${cleanText}###PDF_DATA###${result.secure_url}`);
              continue;
            } catch (cloudErr) {
              console.error('Cloudinary PDF Upload Error:', cloudErr);
            }
          }
        }
        processedLabTests.push(test);
      }

      const latestClinicalRecord = {
        chiefComplaint: req.body.clinicalRecord?.chiefComplaint !== undefined ? req.body.clinicalRecord.chiefComplaint : patient.clinicalRecord?.chiefComplaint,
        diagnosis: req.body.clinicalRecord?.diagnosis !== undefined ? req.body.clinicalRecord.diagnosis : patient.clinicalRecord?.diagnosis,
        prescriptions: req.body.clinicalRecord?.prescriptions || patient.clinicalRecord?.prescriptions || [],
        labTests: processedLabTests,
        doctorNotes: req.body.clinicalRecord?.doctorNotes !== undefined ? req.body.clinicalRecord.doctorNotes : patient.clinicalRecord?.doctorNotes,
        followUpDate: req.body.clinicalRecord?.followUpDate || patient.clinicalRecord?.followUpDate
      };

      patient.clinicalRecord = latestClinicalRecord;

      // Also create a date-wise medical record file entry if diagnosis or prescriptions exist
      if (req.body.clinicalRecord && (req.body.clinicalRecord.diagnosis || req.body.clinicalRecord.chiefComplaint || (req.body.clinicalRecord.prescriptions && req.body.clinicalRecord.prescriptions.length > 0) || (processedLabTests && processedLabTests.length > 0))) {
        if (!patient.medicalRecords) {
          patient.medicalRecords = [];
        }

        const consultationDate = req.body.consultationDate ? new Date(req.body.consultationDate) : new Date();
        const dateStr = consultationDate.toDateString();

        // Check if there's already a record created today/same session by this doctor to update or create new
        const existingTodayIdx = patient.medicalRecords.findIndex(r => 
          new Date(r.date).toDateString() === dateStr
        );

        const recordEntry = {
          recordId: existingTodayIdx >= 0 ? patient.medicalRecords[existingTodayIdx].recordId : `REC-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          date: consultationDate,
          doctor: {
            name: req.body.doctor?.name || 'Dr. Ritik Pandey',
            specialty: req.body.doctor?.specialty || 'General Physician'
          },
          vitals: {
            bloodPressure: patient.vitals?.bloodPressure || '--/--',
            heartRate: patient.vitals?.heartRate || '--',
            weight: patient.vitals?.weight || '--',
            sugarLevel: patient.vitals?.sugarLevel || '--',
            temperature: patient.vitals?.temperature || '--'
          },
          chiefComplaint: latestClinicalRecord.chiefComplaint,
          diagnosis: latestClinicalRecord.diagnosis || 'Clinical Consultation',
          prescriptions: latestClinicalRecord.prescriptions,
          labTests: latestClinicalRecord.labTests,
          doctorNotes: latestClinicalRecord.doctorNotes,
          followUpDate: latestClinicalRecord.followUpDate
        };

        if (existingTodayIdx >= 0) {
          patient.medicalRecords[existingTodayIdx] = recordEntry;
        } else {
          patient.medicalRecords.unshift(recordEntry);
        }
      }

      const updatedPatient = await patient.save();
      res.json({ 
        vitals: updatedPatient.vitals, 
        clinicalRecord: updatedPatient.clinicalRecord,
        medicalRecords: updatedPatient.medicalRecords 
      });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile across dedicated collection
// @route   PUT /api/users/profile/:id
// @access  Public
export const updateUserProfile = async (req, res) => {
  try {
    const { user, model: TargetModel } = await findUserById(req.params.id);

    if (user && TargetModel) {
      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.dateOfBirth) user.dateOfBirth = req.body.dateOfBirth;
      if (req.body.gender) user.gender = req.body.gender;
      if (req.body.bloodGroup) user.bloodGroup = req.body.bloodGroup;
      if (req.body.phone) user.phone = req.body.phone;
      if (req.body.specialty !== undefined) user.specialty = req.body.specialty;
      if (req.body.department !== undefined) user.department = req.body.department;
      
      if (req.body.emergencyContact) {
        if (!user.emergencyContact) user.emergencyContact = {};
        if (req.body.emergencyContact.name) user.emergencyContact.name = req.body.emergencyContact.name;
        if (req.body.emergencyContact.phone) user.emergencyContact.phone = req.body.emergencyContact.phone;
      }

      if (req.body.address) {
        if (!user.address) user.address = {};
        if (req.body.address.state) user.address.state = req.body.address.state;
        if (req.body.address.city) user.address.city = req.body.address.city;
        if (req.body.address.street) user.address.street = req.body.address.street;
        if (req.body.address.pinCode) user.address.pinCode = req.body.address.pinCode;
      }

      // Password change logic
      if (req.body.newPassword && req.body.newPassword.trim() !== '') {
        if (req.body.currentPassword) {
          const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
          if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
          }
        }
        if (req.body.newPassword.length < 6) {
          return res.status(400).json({ message: 'New password must be at least 6 characters.' });
        }
        user.password = req.body.newPassword;
      }

      const updatedUser = await user.save();
      const userObj = updatedUser.toObject();
      delete userObj.password;
      res.json(userObj);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user from their dedicated collection
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (req, res) => {
  try {
    const { user, model: TargetModel } = await findUserById(req.params.id);
    if (user && TargetModel) {
      await TargetModel.deleteOne({ _id: req.params.id });
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record lab test payment in database
// @route   POST /api/users/patients/:id/lab-payment
// @access  Public
export const recordLabPayment = async (req, res) => {
  try {
    const { testName, amount, paymentMethod } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      if (!patient.paidLabTests) {
        patient.paidLabTests = [];
      }

      const cleanTestName = (testName || '').trim();
      const alreadyPaid = patient.paidLabTests.some(p => 
        p.testName?.toLowerCase().trim() === cleanTestName.toLowerCase()
      );

      if (!alreadyPaid) {
        patient.paidLabTests.push({
          testName: cleanTestName || 'Diagnostic Lab Test',
          amount: amount || 350,
          paymentMethod: paymentMethod || 'Cash',
          paidAt: new Date(),
          status: 'Paid'
        });
        await patient.save();
      }

      res.status(200).json({ 
        message: 'Lab payment recorded successfully in database', 
        paidLabTests: patient.paidLabTests 
      });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
