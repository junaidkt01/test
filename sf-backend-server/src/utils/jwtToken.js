require('dotenv').config();
const jwt = require('jsonwebtoken');

async function generateToken(studioname, businessEmail, studioid) {
  const payload = {
    userId: studioid,
    studioName: studioname,
    userName: businessEmail
  };
  const secretKey = process.env.JWT_SECRET || 'DavisKurian'; // Use environment variables for security
  const options = {
    expiresIn: '24h', // Token expiration time
  };
  return jwt.sign(payload, secretKey, options);
}


async function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    console.log("Auth ... "+authorization)

    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const secretKey = process.env.JWT_SECRET || 'DavisKurian';
  
    jwt.verify(token, secretKey, (err, studioInfo) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.studioInfo = studioInfo;
      next(); // Proceed to the next middleware or route handler
    });
  }

  function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });
    const secretKey = process.env.JWT_SECRET || 'DavisKurian';
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = decoded;
      next();
    });
  }

  
module.exports = { generateToken, verifyToken,authMiddleware}; 