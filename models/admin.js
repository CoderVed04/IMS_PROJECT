const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;

//   Encrypt password before saving to DB
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  });

const loginAdmin = async (req, res, next) => {
    const { uname, password } = req.body
    // Check if username and password is provided
    if (!uname || !password) {
      return res.status(400).json({
        message: "Username or Password not present",
      })
    }
    try {
      const admin = await Admin.findOne({ uname })
      if (!admin) {
        res.status(400).json({
          message: "Login not successful",
          error: "User not found",
        })
      } else {
        // comparing given password with hashed password
        bcrypt.compare(password, admin.password).then(function (result) {
          result
            ? res.status(200).json({
                message: "Login successful",
                user,
              })
            : res.status(400).json({ message: "Login not successful" })
        })
      }
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      })
    }
  }

  module.exports = {loginAdmin};