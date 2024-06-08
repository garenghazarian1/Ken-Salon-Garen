import Transaction from '../models/Transaction.js';

// Calculate store income
export const calculateStoreIncome = async (req, res) => {
  const { storeId } = req.params;

  try {
    const transactions = await Transaction.find({ store: storeId });
    
    const totalIncome = transactions.reduce((acc, transaction) => {
      return acc + transaction.totalAmount;
    }, 0);

    res.status(200).json({ storeId, totalIncome });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate employee income
export const calculateEmployeeIncome = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const transactions = await Transaction.find({ employee: employeeId });

    const totalIncome = transactions.reduce((acc, transaction) => {
      return acc + transaction.totalAmount;
    }, 0);

    res.status(200).json({ employeeId, totalIncome });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new transaction
export const createTransaction = async (req, res) => {
  const {
    store,
    employee,
    employeeName,
    employeeDetails,
    services,
    serviceDetailsTitle,
    serviceDetailsPrice,
    clientName,
    clientPhone,
    clientEmail,
    additionalPayments,
    additionalPaymentsPrice,
    productsName,
    productsPrice,
    discount,
    tax,
    currency,
    paymentMethod,
    transactionType,
    status,
    totalAmount,
    transactionDate,
    invoiceNumber,
    location,
    notes,
  } = req.body;

  try {
    const transaction = new Transaction({
      store,
      employee,
      employeeName,
      employeeDetails,
      services,
      serviceDetailsTitle,
      serviceDetailsPrice,
      clientName,
      clientPhone,
      clientEmail,
      additionalPayments,
      additionalPaymentsPrice,
      productsName,
      productsPrice,
      discount,
      tax,
      currency,
      paymentMethod,
      transactionType,
      status,
      totalAmount,
      transactionDate,
      invoiceNumber,
      location,
      notes,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('store')
      .populate('employee')
      .populate('services');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id)
      .populate('store')
      .populate('employee')
      .populate('services');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update transaction
export const updateTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
