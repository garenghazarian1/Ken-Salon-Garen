// routes/availabilityRoutes.js
import express from 'express';
import { protect, owner } from '../middlewares/authMiddleware.js';
import { addAvailability, updateAvailability, deleteAvailability, getAllAvailabilities, getAvailabilityById } from '../controllers/availabilityController.js';

const router = express.Router();
router.post('/', protect, owner, addAvailability);
router.put('/:id', protect, owner, updateAvailability);
router.delete('/:id', protect, owner, deleteAvailability);
router.get('/', getAllAvailabilities);
router.get('/:id', getAvailabilityById);

export default router;
