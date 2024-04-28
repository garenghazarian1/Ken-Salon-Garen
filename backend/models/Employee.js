import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  userInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sections: [{ type: String, required: true }],
}, { timestamps: true });
const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
