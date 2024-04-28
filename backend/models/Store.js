import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  phone: String,
  mobile: String,
  email: String,
  imageStore: { type: String, required: false },
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);

export default Store;
