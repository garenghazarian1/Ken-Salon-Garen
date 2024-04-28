import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  dates: [{ type: Date, required: true }], 
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { timestamps: true });

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;
