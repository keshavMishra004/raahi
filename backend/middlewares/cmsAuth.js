// Middleware to protect routes using JWT authentication

import jwt from 'jsonwebtoken';
import OperatorModel from '../models/operator.model.js';

// Protect middleware: checks for JWT token and attaches user to req
export const cmsAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // if token not found, send appropriate response
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Please Login Again.' });
    }
    
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied! Please Login Again." });
    }

    try {
        // Verify JWT token and attach user to req
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.operator = await OperatorModel.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
