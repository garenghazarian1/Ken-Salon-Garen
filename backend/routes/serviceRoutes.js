// routes/serviceRoutes.js
import express from 'express';
import { protect, owner } from '../middlewares/authMiddleware.js';
import { createService, getAllServices, getServiceById, updateService, deleteService } from '../controllers/serviceController.js';

const router = express.Router();

router.route('/')
  .post(protect, owner, createService)
  .get(getAllServices);

router.route('/:id')
  .get(getServiceById)
  .put(protect, owner, updateService)
  .delete(protect, owner, deleteService);

export default router;
