import Unavailability from '../models/EmployeeUnavilability.js';

import mongoose from 'mongoose';

export const createEmployeeUnavailability = async (req, res) => {
  let unavailability; // Declare the variable outside the try block to widen its scope
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    unavailability = new Unavailability({
      ...req.body, // Assuming Unavailability is a Mongoose model
    });
    await unavailability.save({ session });
    await session.commitTransaction();
    session.endSession(); // End the session here within the try block
  } catch (error) {
    console.error('Error creating employee unavailability:', error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession(); // Make sure to end the session in the catch block as well
    return res.status(400).json({ message: error.message }); // Use return to ensure the function exits after sending the response
  }
  // Send the response outside of the try-catch block, ensuring `unavailability` is accessible
  return res.status(201).json(unavailability);
};



  

// GET ALL UNAVAILABILITIES **************************************************************
export const getAllUnavailabilities = async (req, res) => {
  try {
    const query = {};

    // Check if an employeeId query parameter is provided and adjust the query
    if (req.query.employeeId) {
      query.employee = req.query.employeeId;
    }

    const unavailabilities = await Unavailability.find(query).populate('employee', 'name position');
    res.json(unavailabilities);
  } catch (error) {
    console.error('Failed to fetch unavailabilities:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET A SINGLE UNAVAILABILITY BY ID ***********************************************
export const getUnavailabilityById = async (req, res) => {
  try {
    const unavailability = await Unavailability.findById(req.params.id).populate('employee', 'name position');
    if (!unavailability) {
      return res.status(404).json({ message: 'Unavailability not found' });
    }
    res.json(unavailability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE EMPLOYEE UNAVAILABILITY
export const updateEmployeeUnavailability = async (req, res) => {
  try {
    const unavailability = await Unavailability.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!unavailability) {
      return res.status(404).json({ message: 'Employee unavailability not found' });
    }
    res.json(unavailability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE EMPLOYEE UNAVAILABILITY
export const deleteEmployeeUnavailability = async (req, res) => {
  try {
    const unavailability = await Unavailability.findByIdAndDelete(req.params.id);
    if (!unavailability) {
      return res.status(404).json({ message: 'Employee unavailability not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
