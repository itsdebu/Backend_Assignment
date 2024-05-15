const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.SECRETKEY);

      if (decoded && decoded.adminId) {
        const userId = decoded.adminId;

        // Check if the user exists in the database
        const admin = await Admin.findById(userId);

        if (!admin) {
          return res
            .status(401)
            .json({ success: false, error: "User not found" });
        }

        req.admin = { _id: userId };

        return next(); // Call next to proceed to the next middleware or route handler
      } else {
        return res.status(401).json({ success: false, error: "Invalid token" });
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: "User is not authorized or Invalid Token",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: "User is not authorized or token is missing",
    });
  }
};

module.exports = { validateToken };
