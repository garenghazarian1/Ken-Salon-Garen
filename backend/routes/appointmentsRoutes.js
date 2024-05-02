import express from 'express';
import { bookAppointment, getUserAppointments, getAllAppointments, getAppointmentsByDate, deleteAppointment  } from '../controllers/appointmentController.js';
import authenticateToken  from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post('/', bookAppointment);
router.get('/myAppointments', authenticateToken, getUserAppointments);
router.get('/allAppointments', getAllAppointments);
router.get('/byDate', getAppointmentsByDate);
router.delete('/:appointmentId', authenticateToken, deleteAppointment); // Add this line for delete


export default router;
