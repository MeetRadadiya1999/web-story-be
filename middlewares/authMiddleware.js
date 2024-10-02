// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const tokenHeader = req.header('Authorization');
  
//   // Check if token header is present
//   if (!tokenHeader) {
//     return res.status(401).json({ message: 'Authorization denied: No token provided' });
//   }

//   const token = tokenHeader.split(' ')[1]; // Splits "Bearer tokenvalue" and takes the token
  
//   if (!token) {
//     return res.status(401).json({ message: 'Authorization denied: Token not found' });
//   }

//   try {
//     // Check if JWT secret is defined
//     if (!process.env.JWT_SECRET) {
//       throw new Error('JWT secret is not defined');
//     }
    

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// console.log('Decoded Token:', decoded); // Check what is decoded





//     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { userId: decoded.userId }; // Adjusted to match token payload
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error.message); // Log error for debugging
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Splitting the Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.user.userId }; // Adjusted to match token structure
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};


module.exports = authMiddleware; // Exporting as default
