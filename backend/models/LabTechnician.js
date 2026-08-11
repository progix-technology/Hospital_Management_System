import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const labTechnicianSchema = mongoose.Schema(
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
      default: 'lab_technician',
    },
    department: { type: String, default: 'Pathology & Diagnostic Laboratory' },
    phone: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },
    address: {
      state: { type: String },
      city: { type: String },
      street: { type: String },
      pinCode: { type: String }
    }
  },
  {
    timestamps: true,
  }
);

labTechnicianSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

labTechnicianSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const LabTechnician = mongoose.model('LabTechnician', labTechnicianSchema);

export default LabTechnician;
