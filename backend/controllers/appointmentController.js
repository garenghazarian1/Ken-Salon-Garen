// controllers/appointmentController.js
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import StoreHours from '../models/StoreHours.js';
import StoreClosure from '../models/StoreClosures.js';
import Availability from "../models/EmployeeAvailability.js";
import Unavailability from "../models/EmployeeUnavilability.js";
import Employee from "../models/Employee.js";
import schedule from 'node-schedule';
import twilio from 'twilio';
import {twilioConfig} from "../services/whatsappService.js"
import dotenv from 'dotenv';

dotenv.config();




// MAKE AN APPOINTMENT*****************************************************
async function isStoreOpen(storeId, date, startTime, endTime) {
    const dayOfWeek = new Date(date).getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const storeHours = await StoreHours.findOne({ store: storeId, day: days[dayOfWeek] });

    if (!storeHours || !storeHours.isOpen) {
        return false; // Store is closed on this day
    }
    const openingTime = new Date(`${date}T${storeHours.openTime}`).getTime();
    const closingTime = new Date(`${date}T${storeHours.closeTime}`).getTime();
    const appointmentStart = new Date(`${date}T${startTime}`).getTime();
    const appointmentEnd = new Date(`${date}T${endTime}`).getTime();

    return appointmentStart >= openingTime && appointmentEnd <= closingTime;
}

async function isDateClosed(storeId, date) {
    const closure = await StoreClosure.findOne({
        store: storeId,
        closureDate: { $eq: new Date(date) }
    });
    return !!closure;
}

function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date(0, 0, 0, hours, minutes + duration);
    return `${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`; // Added padding for minutes
}





const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Helper function to calculate reminder time
 function getReminderTime(date, startTime) {
     const appointmentTime = new Date(`${date}T${startTime}Z`); // Ensure UTC time zone
     return new Date(appointmentTime.getTime() - 4 * 3600 * 1000); // Subtract 4 hours
 }

export const bookAppointment = async (req, res) => {
    const { date, startTime, user: userId, employee, services, storeId, phoneNumber, comment } = req.body;
   

    console.log("Request Body:", req.body);

    try {
        const dayOfWeek = new Date(date).getDay();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const serviceDetails = await Service.find({ '_id': { $in: services } });
        if (!serviceDetails.length) {
            return res.status(400).json({ success: false, message: 'One or more services not found.' });
        }

        const totalDuration = serviceDetails.reduce((total, service) => total + service.duration, 0);
        const endTime = calculateEndTime(startTime, totalDuration);

        if (await isDateClosed(storeId, date)) {
            return res.status(400).json({ success: false, message: 'Store is closed on this date.' });
        }

        if (!await isStoreOpen(storeId, date, startTime, endTime)) {
            return res.status(400).json({ success: false, message: 'Store is not open during the selected times.' });
        }

        const availability = await Availability.findOne({
            employee: employee,
            day: days[dayOfWeek],
            startTime: { $lte: startTime },
            endTime: { $gte: endTime }
        });

        if (!availability) {
            return res.status(400).json({ success: false, message: 'Employee is not available at this time.' });
        }

        if (await Unavailability.findOne({
            employee: employee,
            unavailableDates: { $in: [new Date(date)] }
        })) {
            return res.status(400).json({ success: false, message: 'Employee is unavailable on this date.' });
        }

        if (await Appointment.findOne({
            employee: employee,
            date: date,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        })) {
            return res.status(400).json({ success: false, message: 'Employee is not available in the given time slot.' });
        }

        const newAppointment = new Appointment({
            user: userId, employee, services, date, startTime, endTime, status: 'pending', phoneNumber, comment
        });

        await newAppointment.save();


       // Populate user details right after saving to use in the message
       const populatedAppointment = await Appointment.findById(newAppointment._id)
       .populate({
           path: 'user',
           select: 'name phoneNumber'  // Include phoneNumber in the population
       })
       .populate({
           path: 'employee',
           populate: {
               path: 'userInfo',
               select: 'name'
           }
       });

       // Send WhatsApp message
 try {
     const reminderTime = getReminderTime(date, startTime);
     const messageBody = `Hi ${populatedAppointment.user.name}, this is a reminder for your appointment on ${date} at ${startTime}. Please contact us if you have any questions.`;

     await client.messages.create({
         from: 'whatsapp:+4915257398979',
         body: messageBody,
         to: `whatsapp:${populatedAppointment.user.phoneNumber}`
     });
     console.log('WhatsApp message sent immediately.');

     // Schedule the WhatsApp reminder message
     schedule.scheduleJob(reminderTime, async () => {
         await client.messages.create({
             from: 'whatsapp:+4915257398979',
             body: messageBody,
             to: `whatsapp:${populatedAppointment.user.phoneNumber}`
         });
         console.log('WhatsApp reminder sent.');
     });
 } catch (error) {
     console.error('Error sending WhatsApp message:', error);
     // Handle errors, maybe reschedule or log the failure
 }

        res.status(201).json({ success: true, appointment: newAppointment });
    } catch (error) {
        console.error('Error booking the appointment:', error);
        res.status(500).json({ success: false, message: 'Error saving the appointment.', error: error.message });
    }
        
};







  







// GET ALL APPOINTMENTS ***********************
export const getAllAppointments = async (req, res) => {
    try {
        const allAppointments = await Appointment.find()
        .populate({
            path: 'user',
            select: 'name phoneNumber' // Correctly populating user name and phoneNumber
        })
            .populate({
                path: 'employee',
                populate: {
                    path: 'userInfo',
                    select: 'name email phoneNumber' // Populates employee's user information
                }
            })
            .populate({
                path: 'services', // Populates service details
                select: 'title description price duration category section isActive' // Selecting fields to populate
            })
            .sort('date')
            .lean();
        
        res.status(200).json({ success: true, allAppointments });
    } catch (error) {
        console.error('Failed to fetch all appointments: ', error);
        res.status(500).json({ success: false, message: "Failed to fetch all appointments backend", error: error.message });
    }
};


// GET USER APPOINTMENTS ***********************
export const getUserAppointments = async (req, res) => {
    const userId = req.user;  
    // console.log("🚀 ~ getUserAppointments ~ userId:", userId);

    try {
        const appointments = await Appointment.find({ user: userId })
        .populate('user', 'name') // Populates user name
        .populate({
            path: 'employee',
            populate: {
                path: 'userInfo',
                select: 'name' 
            }
        })
        .populate({
            path: 'services', // Populates service details
            select: 'title description price duration category section isActive' // Selecting fields to populate
        })
        .exec();

        console.log(JSON.stringify(appointments, null, 2));
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch appointments', error: error.message });
    }
};


// DELETE AN APPOINTMENT ************************
export const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params; // ID of the appointment to delete
  const userId = req.user;
  const userRole = req.user.role; 

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Allow deletion if the user is the owner of the appointment or has the 'owner' role
    if (appointment.user.toString() === userId || userRole === 'owner') {
      await Appointment.findByIdAndDelete(appointmentId);
      res.json({ success: true, message: "Appointment deleted successfully" });
    } else {
      // If the user is neither the owner of the appointment nor has the 'owner' role, deny deletion
      res.status(403).json({ success: false, message: "Unauthorized to delete this appointment" });
    }
  } catch (error) {
    console.error('Failed to delete the appointment: ', error);
    res.status(500).json({ success: false, message: "Failed to delete the appointment", error: error.message });
  }
};


export const getAppointmentsByDate = async (req, res) => {
  const { date, slot } = req.query; // Extract both date and slot from query parameters

  try {
    let query = { date }; // Start with date-based filtering
    if (slot) {
      query.slot = slot; // Add slot-based filtering if a slot is provided
    }
    const appointments = await Appointment.find(query).populate('user', 'name');
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Failed to fetch appointments by date and slot:', error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments", error: error.message });
  }
};

export const getEmployeeAppointments = async (req, res) => {
    

    try {
        const employeeData = await Employee.findOne({ userInfo: req.user});
        if (!employeeData) {
            return res.status(404).json({ message: 'Employee profile not found' });
        }

        const appointments = await Appointment.find({ employee: employeeData._id })
            .populate('user', 'name email phoneNumber')  // Optionally populating user's name and email
            .populate({
                path: 'services',
                select: 'title description price duration category section isActive'
            })
            .sort({ date: 1 })
            .exec();

        console.log("Fetched Appointments: ", JSON.stringify(appointments, null, 2));
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error('Failed to fetch appointments for employee:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch employee appointments', error: error.message });
    }
};

