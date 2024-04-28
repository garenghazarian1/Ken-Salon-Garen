// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  title: { type: String, required: true },
  description: { type: String }, 
  duration: { type: Number, required: true }, 
  price: { type: Number, required: true }, 
  category: { type: String, required: true },
  section: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
