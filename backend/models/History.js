// models/History.js
import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  employee:  { type: String, required: false },
  consultedBy: { type: String, required: false },
  colorAppliedBy: { type: String, required: false },
  
},
{ timestamps: true });

const History = mongoose.model('History', historySchema);

export default History;
