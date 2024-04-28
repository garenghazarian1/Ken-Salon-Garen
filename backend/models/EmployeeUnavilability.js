import mongoose from 'mongoose';

const unavailabilitySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  type: { type: String, enum: ['vacation', 'illness', 'other'], default: 'other' },
  unavailableDates: [{ type: Date, required: true }],
  reason: { type: String, default: '' },
}, { timestamps: true });

const Unavailability = mongoose.model('Unavailability', unavailabilitySchema);

export default Unavailability;
