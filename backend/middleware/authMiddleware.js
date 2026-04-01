const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      // Get token from header and trim any whitespace
      token = req.headers.authorization.split(" ")[1].trim();
      
      if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.user || !decoded.user.id) {
          return res.status(401).json({ message: "Invalid token format" });
        }

        // Get user from the token (exclude password)
        const user = await User.findById(decoded.user.id).select("-password");

        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        // Set user in request object
        req.user = user;
        next();
        
      } catch (verifyError) {
        console.error("Token verification error:", verifyError.message);
        if (verifyError.name === "JsonWebTokenError") {
          return res.status(401).json({ 
            message: "Invalid token format",
            error: verifyError.message 
          });
        }
        if (verifyError.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token has expired" });
        }
        throw verifyError;
      }
    } else {
      return res.status(401).json({ message: "Authorization header must start with Bearer" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Server authentication error" });
  }
};

//middleware to check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
