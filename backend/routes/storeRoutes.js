import express from 'express';
import { createStore, getAllStores, getStoreById, updateStore, deleteStore } from '../controllers/storeController.js';
import uploadCloud from '../middlewares/multerCloudinary.js';
import { protect, owner } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply 'protect' and 'owner' middleware to routes that modify store data
router.post('/', protect, owner, uploadCloud.single('imageStore'), createStore);
router.put('/:id', protect, owner, uploadCloud.single('imageStore'), updateStore);
router.delete('/:id', protect, owner, deleteStore);

// Routes for fetching store data can remain open or protected without the 'owner' check, depending on your app's requirements
router.get('/', getAllStores);
router.get('/:id', getStoreById);

export default router;
