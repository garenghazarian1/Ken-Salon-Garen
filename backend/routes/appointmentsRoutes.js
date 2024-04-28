import express from 'express';
import { bookAppointment, getUserAppointments, getAllAppointments, getAppointmentsByDate  } from '../controllers/appointmentController.js';
import authenticateToken  from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post('/', bookAppointment);
router.get('/myAppointments', authenticateToken, getUserAppointments);
router.get('/allAppointments', getAllAppointments);
router.get('/byDate', getAppointmentsByDate);

export default router;
