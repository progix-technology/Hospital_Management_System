import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import LabTechnician from '../models/LabTechnician.js';
import Admin from '../models/Admin.js';

export const getModelByRole = (role) => {
  switch (role) {
    case 'doctor':
      return Doctor;
    case 'lab_technician':
      return LabTechnician;
    case 'admin':
      return Admin;
    case 'patient':
    default:
      return Patient;
  }
};

export const findUserByEmail = async (email) => {
  let user = await Patient.findOne({ email });
  if (user) return { user, role: 'patient' };

  user = await Doctor.findOne({ email });
  if (user) return { user, role: 'doctor' };

  user = await LabTechnician.findOne({ email });
  if (user) return { user, role: 'lab_technician' };

  user = await Admin.findOne({ email });
  if (user) return { user, role: 'admin' };

  return { user: null, role: null };
};

export const findUserById = async (id) => {
  let user = await Patient.findById(id);
  if (user) return { user, role: 'patient', model: Patient };

  user = await Doctor.findById(id);
  if (user) return { user, role: 'doctor', model: Doctor };

  user = await LabTechnician.findById(id);
  if (user) return { user, role: 'lab_technician', model: LabTechnician };

  user = await Admin.findById(id);
  if (user) return { user, role: 'admin', model: Admin };

  return { user: null, role: null, model: null };
};
