import express from 'express';

import {  createEmployeeUnavailability,  getAllUnavailabilities,  getUnavailabilityById,  updateEmployeeUnavailability,  deleteEmployeeUnavailability } from '../controllers/employeeUnavailabilityController.js';
import { protect, owner } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply 'protect' and 'owner' middleware to routes that modify employee unavailability data
router.post('/', protect, owner, createEmployeeUnavailability);
router.put('/:id', protect, owner, updateEmployeeUnavailability);
router.delete('/:id', protect, owner, deleteEmployeeUnavailability);

// Routes for fetching employee unavailability data can remain open or protected without the 'owner' check, depending on your app's requirements
router.get('/', getAllUnavailabilities);
router.get('/:id', getUnavailabilityById);

export default router;
