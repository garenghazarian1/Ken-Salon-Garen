import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  calculateStoreIncome,
  calculateEmployeeIncome
} from '../controllers/transactionController.js';
import { protect, owner } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply 'protect' and 'owner' middleware to routes that modify transaction data
router.post('/', protect, owner, createTransaction);
router.put('/:id', protect, owner, updateTransaction);
router.delete('/:id', protect, owner, deleteTransaction);

// Routes for fetching transaction data can remain open or protected without the 'owner' check, depending on your app's requirements
router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransactionById);
router.get('/store/:storeId/income', protect, calculateStoreIncome);
router.get('/employee/:employeeId/income', protect, calculateEmployeeIncome);

export default router;
