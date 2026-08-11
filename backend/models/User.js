import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
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
      enum: ['patient', 'doctor', 'admin', 'lab_technician'],
      default: 'patient',
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    specialty: { type: String, default: 'General Physician' },
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
    }
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
