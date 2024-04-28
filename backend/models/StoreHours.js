import mongoose from 'mongoose';

const storeHoursSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  day: { type: String, required: true },
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  isOpen: { type: Boolean, default: true } // Optional: to easily mark the store as open/closed for the day
}, { timestamps: true });

const StoreHours = mongoose.model('StoreHours', storeHoursSchema);

export default StoreHours;
