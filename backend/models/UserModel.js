import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
  
  name: { type: String, required: true, trim: true },
  email: {  type: String,  required: true,  unique: true,  trim: true, },
  password: {  type: String,  required: true,  trim: true, minlength: [6, 'Password must be at least 6 characters long.'] },
  role: { type: String, enum: ["user","employee", "admin", "owner"], default: "user" },
  dateOfBirth: { type: Date, required: false }, 
  image: { type: String, required: false }, 
  
    street: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    state: { type: String, required: false, trim: true },
    zipCode: { type: String, required: false, trim: true },
  
  phoneNumber: { type: String, required: true, trim: true },
  authMethod: { type: String, enum: ['local', 'google'], default: 'local' },
  otp: { type: String, required: false },
  otpExpiry: { type: Date, required: false },
}, 
  {timestamps: true,}
);

const User = mongoose.model('User', userSchema);

export default User;
