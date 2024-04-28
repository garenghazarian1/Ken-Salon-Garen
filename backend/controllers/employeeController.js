// controllers/employeeController.js
import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
import User from '../models/UserModel.js'

// CREATE A NEW EMPLOYEE ****************************
export const createEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const newEmployee = new Employee({
      ...req.body,
      userInfo: req.body.userInfo
    });
    await newEmployee.save({ session });
    await User.findByIdAndUpdate(req.body.userInfo, { role: 'employee' }, { new: true, session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newEmployee);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ message: error.message });
  }
};

// UPDATE AN EMPLOYEE *************************************
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE AN EMPLOYEE AND REVERT ASSOCIATED USER'S ROLE TO "USER"
export const deleteEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }
    await Employee.findByIdAndDelete(req.params.id, { session });

    await User.findByIdAndUpdate(employee.userInfo, { role: 'user' }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Employee deleted and user role reverted to normal user' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: error.message });
  }
};


// GET ALL EMPLOYEES **************************************************************
export const getAllEmployees = async (req, res) => {
  try {
    // Build a query object based on the presence of storeId in the query parameters
    const query = req.query.storeId ? { store: req.query.storeId } : {};

    // Use the query object to filter employees by store, if storeId is provided
    const employees = await Employee.find(query).populate('userInfo', 'name email image role').populate('store', 'name location').select('+sections');
    res.json(employees);
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    res.status(500).json({ message: error.message });
  }
};
  
  // GET A SINGLE EMPLOYEE BY ID ***********************************************
  export const getEmployeeById = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id).populate('userInfo', 'name email role').select('+sections');; 
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // getEmployeesBySection
export const getEmployeesBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const employees = await Employee.find({
      sections: { $in: [sectionId] }
    }).populate('userInfo', 'name email');

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  
  // getEmployeesByCategory
  export const getEmployeesByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params; 
      const employees = await Employee.find({
        serviceCategories: { $in: [categoryId] } 
      }).populate('userInfo', 'name email');
      
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  