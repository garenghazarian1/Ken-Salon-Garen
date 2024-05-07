import express from 'express';
import { bookAppointment, getUserAppointments, getAllAppointments, getAppointmentsByDate, deleteAppointment, getEmployeeAppointments   } from '../controllers/appointmentController.js';
import authenticateToken  from "../middlewares/userMiddleware.js";
import {checkEmployee} from "../middlewares/checkEmployee.js"

const router = express.Router();

router.post('/', bookAppointment);
router.get('/myAppointments', authenticateToken, getUserAppointments);
router.get('/employeeAppointments', authenticateToken,checkEmployee, getEmployeeAppointments);
router.get('/allAppointments', getAllAppointments);
router.get('/byDate', getAppointmentsByDate);
router.delete('/:appointmentId', authenticateToken, deleteAppointment);


export default router;
