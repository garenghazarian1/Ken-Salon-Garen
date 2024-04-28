// controllers/serviceController.js
import Store from '../models/Store.js';
import Service from '../models/Service.js';

// CREATE SERVICE *************************************
export const createService = async (req, res) => {
  try {
    const { storeId, ...serviceDetails } = req.body;
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    const service = new Service({
      store: storeId,
      ...serviceDetails
    });
    await service.save();

    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ message: 'Error creating service', error: error.message });
  }
};

// GET ALL SERVICES ************************************
// export const getAllServices = async (req, res) => {
//   const { storeId } = req.query; // Extract storeId from query parameters
//   try {
//     let query = {};
//     // If storeId is provided, use it to filter services
//     if (storeId) {
//       query.store = storeId;
//     }

//     const services = await Service.find(query); // Use the query object to filter services
//     res.json(services);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getAllServices = async (req, res) => {
  const { storeId, section } = req.query; // Extract section from query parameters as well

  try {
    let query = {};
    if (storeId) {
      query.store = storeId;
    }
    if (section) {
      query.section = section; // Add section to the query object if provided
    }

    const services = await Service.find(query);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single service by id
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a service
export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) return res.status(404).json({ message: 'Service not found' });
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
