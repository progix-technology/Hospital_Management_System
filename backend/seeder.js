import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './models/Patient.js';
import Doctor from './models/Doctor.js';
import LabTechnician from './models/LabTechnician.js';
import Admin from './models/Admin.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const resetAndSeed = async () => {
  try {
    console.log('Fixing login credentials for all roles across 4 collections...');

    // 1. Admin Account
    await Admin.deleteMany({});
    await Admin.create({
      name: 'Admin',
      email: 'progixtechnology@gmail.com',
      password: 'Progix@123',
      role: 'admin',
    });
    console.log('✅ Admin account seeded (email: progixtechnology@gmail.com, password: Progix@123)');

    // 2. Doctor Accounts
    let doctor = await Doctor.findOne({ email: 'ravi@medisphere.com' });
    if (!doctor) {
      await Doctor.create({
        name: 'Dr. Ravi Kumar',
        email: 'ravi@medisphere.com',
        password: 'Password123',
        role: 'doctor',
        specialty: 'Cardiologist',
        degree: 'MD, DM (Cardiology)',
        phone: '+91 98765 12345',
        gender: 'Male',
      });
      console.log('✅ Doctor Ravi seeded (email: ravi@medisphere.com, password: Password123)');
    }

    const doctors = await Doctor.find({});
    for (let doc of doctors) {
      doc.password = 'Password123';
      await doc.save();
    }
    console.log('✅ All Doctor passwords reset to Password123');

    // 3. Lab Technician Accounts
    let labTech = await LabTechnician.findOne({ email: 'vasu@gmail.com' });
    if (!labTech) {
      await LabTechnician.create({
        name: 'Vasu Rajpoot',
        email: 'vasu@gmail.com',
        password: 'Password123',
        role: 'lab_technician',
        department: 'Pathology & Diagnostic Laboratory',
        phone: '9999999999',
        gender: 'Male',
      });
      console.log('✅ Lab Technician Vasu seeded (email: vasu@gmail.com, password: Password123)');
    }

    const labTechs = await LabTechnician.find({});
    for (let lt of labTechs) {
      lt.name = lt.name.replace(/^Dr\.\s*/i, '');
      lt.password = 'Password123';
      await lt.save();
    }
    console.log('✅ All Lab Technician passwords reset to Password123');

    // 4. Patient Accounts
    let patient = await Patient.findOne({ email: 'raj@gmail.com' });
    if (!patient) {
      await Patient.create({
        name: 'Raj Tiwari',
        email: 'raj@gmail.com',
        password: 'Password123',
        role: 'patient',
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '9876543210'
      });
      console.log('✅ Patient Raj seeded (email: raj@gmail.com, password: Password123)');
    }

    const patients = await Patient.find({});
    for (let p of patients) {
      p.password = 'Password123';
      await p.save();
    }
    console.log('✅ All Patient passwords reset to Password123');

    console.log('🎉 Login credentials fixed successfully for ALL accounts!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

resetAndSeed();
