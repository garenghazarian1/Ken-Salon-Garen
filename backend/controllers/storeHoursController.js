// controllers/storeHoursController.js


import StoreHours from '../models/StoreHours.js';

// CREATE STORE HOURS *********************************
export const createStoreHours = async (req, res) => {
  const { store, day } = req.body;

  try {
    const existingHours = await StoreHours.findOne({
      store,
      day
    });

    if (existingHours) {
      return res.status(409).json({ message: 'Store hours for this day already exist for the given store.' });
    }

    // If no existing hours are found, proceed to create a new entry
    const storeHours = new StoreHours(req.body);
    await storeHours.save();
    res.status(201).json(storeHours);
  } catch (error) {
    console.error('Error creating store hours:', error);
    res.status(400).json({ message: error.message });
  }
};




// Get store hours by specific store ID, return error if 'store' query parameter is not provided ******************
export const getAllStoreHours = async (req, res) => {
  // const storeId = req.params.storeId || req.query.store;
  const storeId = req.params.storeId;
  try {
    if (!storeId) {
      return res.status(400).json({ message: "Store ID is required as a parameter." });
    }
    const storeHours = await StoreHours.find({ store: storeId });
    if (storeHours.length === 0) {
      return res.status(404).json({ message: 'No store hours found for this store' });
    }
    res.json(storeHours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


  
// Get store hours by ID
export const getStoreHoursById = async (req, res) => {
    try {
      const storeHours = await StoreHours.findById(req.params.id);
      if (!storeHours) {
        return res.status(404).json({ message: 'Store hours not found' });
      }
      res.json(storeHours);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  // Update store hours
export const updateStoreHours = async (req, res) => {
    try {
      const storeHours = await StoreHours.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!storeHours) {
        return res.status(404).json({ message: 'Store hours not found' });
      }
      res.json(storeHours);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  // Delete store hours ********************************
export const deleteStoreHours = async (req, res) => {
    try {
      const storeHours = await StoreHours.findByIdAndDelete(req.params.id);
      if (!storeHours) {
        return res.status(404).json({ message: 'Store hours not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  