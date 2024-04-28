import express from 'express';
import { createStoreClosure, getAllStoreClosures, getStoreClosureById, updateStoreClosure, deleteStoreClosure} from '../controllers/storeClosureController.js';
import { protect, owner } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply 'protect' and 'owner' middleware to routes that modify store closure data
router.post('/', protect, owner, createStoreClosure);
router.put('/:id', protect, owner, updateStoreClosure);
router.delete('/:id', protect, owner, deleteStoreClosure);

// Routes for fetching store closure data can remain open or protected without the 'owner' check, depending on your app's requirements
router.get('/', getAllStoreClosures);
router.get('/:id', getStoreClosureById);

export default router;
