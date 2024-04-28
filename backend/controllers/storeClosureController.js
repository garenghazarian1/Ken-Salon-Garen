import StoreClosure from '../models/StoreClosures.js'; 

// CREATE STORE CLOSURE
export const createStoreClosure = async (req, res) => {
  const { store, closureDate } = req.body;

  try {
    // Check if a closure already exists for this store on the specified date
    const existingClosure = await StoreClosure.findOne({
      store,
      closureDate
    });

    if (existingClosure) {
      return res.status(409).json({ message: 'A closure for this store already exists on this date.' });
    }

    // If no existing closure is found, proceed to create a new one
    const storeClosure = new StoreClosure(req.body);
    await storeClosure.save();
    res.status(201).json(storeClosure);
  } catch (error) {
    console.error('Error creating store closure:', error);
    res.status(400).json({ message: error.message });
  }
};


// GET ALL STORE CLOSURES BY STORE ID
export const getAllStoreClosures = async (req, res) => {
  try {
    if (!req.query.store) {
      return res.status(400).json({ message: "Store ID is required as a query parameter." });
    }
    const storeClosures = await StoreClosure.find({ store: req.query.store });
    if (storeClosures.length === 0) {
      return res.status(200).json([]);
    }
    res.json(storeClosures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET STORE CLOSURE BY ID
export const getStoreClosureById = async (req, res) => {
  try {
    const storeClosure = await StoreClosure.findById(req.params.id);
    if (!storeClosure) {
      return res.status(404).json({ message: 'Store closure not found' });
    }
    res.json(storeClosure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STORE CLOSURE
export const updateStoreClosure = async (req, res) => {
  try {
    const storeClosure = await StoreClosure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!storeClosure) {
      return res.status(404).json({ message: 'Store closure not found' });
    }
    res.json(storeClosure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE STORE CLOSURE
export const deleteStoreClosure = async (req, res) => {
  try {
    const storeClosure = await StoreClosure.findByIdAndDelete(req.params.id);
    if (!storeClosure) {
      return res.status(404).json({ message: 'Store closure not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
