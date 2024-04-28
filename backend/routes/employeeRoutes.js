// routes/employeeRoutes.js
import express from 'express';
import { protect, owner } from '../middlewares/authMiddleware.js';
import { createEmployee, updateEmployee, deleteEmployee, getAllEmployees, getEmployeeById, getEmployeesByCategory, getEmployeesBySection } from '../controllers/employeeController.js';

const router = express.Router();

router.post('/', protect, owner, createEmployee);
router.put('/:id', protect, owner, updateEmployee);
router.delete('/:id', protect, owner, deleteEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.get('/by-category/:categoryId', getEmployeesByCategory);
router.get('/by-section/:sectionId',getEmployeesBySection);


export default router;
