import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'patient',
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String },
    phone: { type: String },
    emergencyContact: {
      name: { type: String },
      phone: { type: String }
    },
    address: {
      state: { type: String },
      city: { type: String },
      street: { type: String },
      pinCode: { type: String }
    },
    vitals: {
      bloodPressure: { type: String, default: '--/--' },
      heartRate: { type: String, default: '--' },
      weight: { type: String, default: '--' },
      sugarLevel: { type: String, default: '--' },
      temperature: { type: String, default: '--' },
      lastUpdated: { type: Date }
    },
    clinicalRecord: {
      chiefComplaint: { type: String, default: '' },
      diagnosis: { type: String, default: '' },
      prescriptions: [{
        medicineName: String,
        dosage: String,
        frequency: String,
        duration: String
      }],
      labTests: [{ type: String }],
      doctorNotes: { type: String, default: '' },
      followUpDate: { type: Date }
    },
    medicalRecords: [{
      recordId: { type: String },
      date: { type: Date, default: Date.now },
      doctor: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
        name: { type: String, default: 'Dr. Ritik Pandey' },
        specialty: { type: String, default: 'General Physician' }
      },
      vitals: {
        bloodPressure: { type: String, default: '--/--' },
        heartRate: { type: String, default: '--' },
        weight: { type: String, default: '--' },
        sugarLevel: { type: String, default: '--' },
        temperature: { type: String, default: '--' }
      },
      chiefComplaint: { type: String, default: '' },
      diagnosis: { type: String, default: '' },
      prescriptions: [{
        medicineName: String,
        dosage: String,
        frequency: String,
        duration: String
      }],
      labTests: [{ type: String }],
      doctorNotes: { type: String, default: '' },
      followUpDate: { type: Date }
    }],
    paidLabTests: [{
      testName: { type: String },
      amount: { type: Number, default: 350 },
      paidAt: { type: Date, default: Date.now },
      paymentMethod: { type: String, default: 'Cash' },
      status: { type: String, default: 'Paid' }
    }]
  },
  {
    timestamps: true,
  }
);

patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

patientSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
