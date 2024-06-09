import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },
  employeeName: { type: String, required: false },
  employeeDetails: { type: String, required: false }, 
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: false }],
  serviceDetailsTitle: { type: String, required: false },
  serviceDetailsPrice: { type: Number, required: false },
  clientName: { type: String, required: false },
  clientPhone: { type: String, required: false },
  clientEmail: { type: String, required: false },
  additionalPayments: [{ type: String, required: false }],
  additionalPaymentsPrice: { type: Number, required: false, default: 0 },
  productsName: { type: String, required: false },
  productsPrice: { type: Number, required: false },
  discount: { type: Number, required: false, default: 0 },
  tax: { type: Number, required: false, default: 0.05 },
  currency: { type: String, required: false, default: 'AED' },
  paymentMethod: { type: String, required: false },
  transactionType: { type: String, required: false, default: 'sale' },
  status: { type: String, required: false, default: 'pending' },
  totalAmount: { type: Number, required: false },
  transactionDate: { type: Date, default: Date.now },
  // invoiceNumber: { type: String, required: false  },
  location: { type: String, required: false },
  notes: { type: String, required: false },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
