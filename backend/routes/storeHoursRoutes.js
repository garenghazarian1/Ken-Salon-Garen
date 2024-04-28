import express from 'express';
import { createStoreHours, getAllStoreHours, getStoreHoursById, updateStoreHours, deleteStoreHours } from '../controllers/storeHoursController.js';
import { protect, owner } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply 'protect' and 'owner' middleware to routes that modify store hours data
router.post('/', protect, owner, createStoreHours);
router.put('/:id', protect, owner, updateStoreHours);
router.delete('/:id', protect, owner, deleteStoreHours);

// Routes for fetching store hours data can remain open or protected without the 'owner' check, depending on your app's requirements

router.get('/by-store/:storeId', getAllStoreHours);
router.get('/', getAllStoreHours);
router.get('/:id', getStoreHoursById);

export default router;
