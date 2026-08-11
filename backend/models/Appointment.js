import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Doctor',
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: 'Checkup',
    },
    status: {
      type: String,
      required: true,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Waiting'],
      default: 'Scheduled',
    },
    fee: {
      type: Number,
      required: true,
      default: 500,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'Card', 'UPI', 'Razorpay', 'Razorpay (Card)', 'Razorpay (UPI)', 'Net Banking'],
      default: 'Cash',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
