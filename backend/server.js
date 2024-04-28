import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import appointmentsRoutes from './routes/appointmentsRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import storeHoursRoutes from './routes/storeHoursRoutes.js'; 
import storeClosureRoutes from './routes/storeClosureRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import employeeUnavailabilityRoutes from './routes/employeeUnavailabilityRoutes.js';

dotenv.config();
const app = express();
connectDB();

app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

//  ROUTES ********************** */
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/storehours', storeHoursRoutes);
app.use('/api/storeclosures', storeClosureRoutes);
app.use('/api/availabilities', availabilityRoutes);
app.use('/api/employee-unavailabilities', employeeUnavailabilityRoutes);

// ERROR HANDLING MIDDLEWARE ***************************
app.use((err, req, res, next) => {
  console.error(err.stack); 
  const statusCode = err.statusCode || 500; 
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
