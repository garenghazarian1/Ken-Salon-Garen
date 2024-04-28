// controllers/availabilityController.js
import mongoose from 'mongoose';
import Availability from '../models/EmployeeAvailability.js';

// ADD A NEW AVAILABILITY ****************************
export const addAvailability = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const newAvailability = new Availability({
      ...req.body, 
    });
    await newAvailability.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newAvailability);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const availability = await Availability.findByIdAndUpdate(
      req.params.id, 
      req.body,  
      { new: true }
    );
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.json(availability);
  } catch (error) {
    console.error('Update Availability Error:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE AN AVAILABILITY *************************************
export const deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findByIdAndDelete(req.params.id);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.json({ message: 'Availability successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL AVAILABILITIES **************************************************************
export const getAllAvailabilities = async (req, res) => {
  try {
    const availabilities = await Availability.find().populate('employee', 'name position');
    res.json(availabilities);
  } catch (error) {
    console.error('Failed to fetch availabilities:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET A SINGLE AVAILABILITY BY ID ***********************************************
export const getAvailabilityById = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id).populate('employee', 'name position');
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
