import Store from '../models/Store.js';

// CREATE A NEW STORE WITH IMAGE **************************************
export const createStore = async (req, res) => {
  try {
    const { name, street, city, state, zipCode, country, phone, mobile, email } = req.body;

    const imageUrl = req.file ? req.file.path : ''; // The URL to the uploaded image
    const imageId = req.file ? req.file.filename : ''; // The Cloudinary public ID for the image

    const store = new Store({ name, street, city, state, zipCode, country, phone, mobile, email, imageStore: imageUrl, imageId: imageId
    });

    await store.save(); 
    res.status(201).json(store); 
  } catch (error) {
    console.error(error, 'Error creating store:' );
    res.status(400).json({ message: 'Error creating store', error: error.message });
  }
};

// GET ALL STORES ***********************************************************
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single store by ID ***********************************************
export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Update store details from request body
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      store[key] = updates[key];
    });

    // Check if a new image was uploaded
    if (req.file) {
      // Assuming 'uploadCloud' middleware sets 'req.file.path' to the Cloudinary URL
      const newImageUrl = req.file.path;
      const newImageId = req.file.filename; // Assuming 'filename' holds the Cloudinary public ID

      // Optional: If the store already has an image, delete the old image from Cloudinary
      if (store.imageId) {
        await cloudinary.uploader.destroy(store.imageId);
      }

      // Update the store with the new image URL and ID
      store.imageStore = newImageUrl;
      store.imageId = newImageId;
    }

    await store.save();
    res.json(store);

  } catch (error) {
    console.error('Error updating store:', error);
    res.status(400).json({ message: 'Error updating store', error: error.message });
  }
};


// Delete a store ******************************************
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    // Optionally, delete the store's image from Cloudinary here if needed
    res.json({ message: 'Store successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
