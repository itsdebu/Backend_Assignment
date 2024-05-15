const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const { signUpValidator, loginValidator } = require("../validation/admin");

const adminSignup = async (req, res) => {
  const { error } = signUpValidator.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already registered with this email.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashPassword,
    });

    const admin = await newAdmin.save();

    // Generating jwt token
    const tokenPayload = {
      adminId: newAdmin._id,
      password: newAdmin.password,
    };
    const accessToken = jwt.sign(tokenPayload, process.env.SECRETKEY, {
      expiresIn: "2h", //update it accordingly, currenlty token expiery time is 2hour
    });

    return res.status(200).json({
      success: true,
      token: accessToken,
      admin,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const adminLogin = async (req, res) => {
  const { error } = loginValidator.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({
        success: false,
        message: "Admin is not registered with this email.",
      });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "password not match or Incorrect Password",
      });
    }
    // Generating jwt token
    const tokenPayload = { adminId: admin._id, email: admin.email };
    const accessToken = jwt.sign(tokenPayload, process.env.SECRETKEY, {
      expiresIn: "365d",
    });

    res.status(200).json({
      message: "Logged In Successfully",
      admin,
      token: accessToken,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = { adminSignup, adminLogin };
