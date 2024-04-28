import Appointment from '../models/Appointment.js';

export const bookAppointment = async (req, res) => {
  const { date, slot, user, service } = req.body;

  try {
    const existingAppointment = await Appointment.findOne({ date, slot });
    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked.' });
    }
    // If no existing appointment is found, proceed to book the new appointment
    const appointment = new Appointment({ user, service, date, slot, status: 'pending' });

    await appointment.save();
    console.log('Appointment saved', appointment);
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error saving the appointment.', error: error.message });
  }
};

// // TEST Linking Services to an Employee
// async function assignServicesToEmployee(employeeId, serviceIds) {
//   try {
//     const employee = await Employee.findById(employeeId);
//     employee.services = serviceIds; // Assuming serviceIds is an array of ObjectId
//     await employee.save();
//     console.log('Services assigned successfully to employee');
//   } catch (error) {
//     console.error('Error assigning services to employee:', error);
//   }
// }

// // TEST Querying Employees and Their Services
// Employee.findById(employeeId).populate('services').exec((err, employee) => {
//   if (err) console.error(err);
//   console.log(employee); // This will include full service details in the 'services' array
// });



// GET ALL APPOINTMENTS ***********************
export const getAllAppointments = async (req, res) => {
  
  try {
    const allAppointments = await Appointment.find().populate('user', 'name').exec();  //.sort('date').exec();  //.lean() for JSON response
    res.json({ success: true, allAppointments });
  } catch (error) {
    console.error('Failed to fetch all appointments: ', error);
    res.status(500).json({  success: false, message: "Failed to fetch all appointments backend ", error: error.message});
  }
}

// GET USER APPOINTMENTS ***********************
export const getUserAppointments = async (req, res) => {
  const userId = req.user; // Use req.user to match the middleware
  console.log("🚀 ~ getUserAppointments ~ userId:", userId)

  try {
    const appointments = await Appointment.find({ user: userId }).populate('user', 'name');
    res.json({ appointments });
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};


// DELETE AN APPOINTMENT ************************
export const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params; // ID of the appointment to delete
  const userId = req.user.id; // User ID from the authenticated user
  const userRole = req.user.role; // User role from the authenticated user

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





//BOOK A NEW APPOINTMENT ************************
//  export const bookAppointment = async (req, res) => {
//    const body = req.body;
//    const appointment = new Appointment(body);
//    try {
//      await appointment.save();
//      console.log('appointment saved',  appointment);
//      res.status(201).json( {success: true, appointment});
//    } catch (error) {
//      console.error(error);
//      res.status(500).json({ success: false, message: 'Error saving the appointment backend.', error: error.message });
//    }
//  };

// NOTE

// BOOK A NEW APPOINTMENT ************************
// export const bookAppointment = async (req, res) => {
 // const { userId, service, date, slot  } = req.body;

  // if (!userId || !service || !date || !slot ) {
  //   return res.status(400).json({ message: 'Missing required fields backend' });
  // }
//   try {
//     const newAppointment = new Appointment({ user: userId, service, date, slot });
//     const savedAppointment = await newAppointment.save();
//     const populatedAppointment = await Appointment.findById(savedAppointment._id).populate('user', 'name');
//     res.status(201).json({ appointment: savedAppointment });
//   } catch (error) {
//     console.error('Error creating appointment: backend', error);
//     res.status(500).json({ message: 'Failed to create appointment backend', error: error.message });
//   }
// };

