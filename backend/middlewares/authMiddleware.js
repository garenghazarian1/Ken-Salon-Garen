// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js'; 

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// middleware/authMiddleware.js (continued)

export const owner = (req, res, next) => {
    if (req.user && req.user.role === 'owner') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as an owner' });
    }
  };
  