import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, enum: ["user","employee", "admin", "owner"], default: "user" },
  dateOfBirth: { type: Date, required: false }, 
  image: { type: String, required: false }, 
  address: {
    street: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    state: { type: String, required: false, trim: true },
    zipCode: { type: String, required: false, trim: true }
  },
  phoneNumber: { type: String, required: false, trim: true }
}, 
  {timestamps: true,}
);

const User = mongoose.model('User', userSchema);

export default User;
