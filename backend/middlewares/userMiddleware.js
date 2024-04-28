// authenticateToken.js

import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Set the authenticated user's ID
    next();
  } catch (error) {
    res.status(403).json({ message: "Token is not valid" });
  }
};

export default authenticateToken;
