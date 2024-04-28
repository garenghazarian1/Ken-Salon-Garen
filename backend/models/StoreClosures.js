import mongoose from 'mongoose';

const storeClosureSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  closureDate: { type: Date, required: true }, // The specific date of the closure
  reason: { type: String, required: true }, // Reason for the closure (e.g., "Holiday", "Vacation")
}, { timestamps: true });

const StoreClosure = mongoose.model('StoreClosure', storeClosureSchema);

export default StoreClosure;
