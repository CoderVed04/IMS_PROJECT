const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const userSchema = new mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

//------------------------------------------------------------------

//   Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  });

//------------------------------------------------------------------

//   // Register User
// const registerUser = asyncHandler(async (req, res) => {
//     const { uname, mobile, email, password } = req.body;
  
//     // Validation
//     if (!uname || !email || !mobile || !password) {
//       res.status(400);
//       throw new Error("Please fill in all required fields");
//     }
//     if (password.length < 6) {
//       res.status(400);
//       throw new Error("Password must be up to 6 characters");
//     }
  
//      // Check if user email already exists
//     const userExists = await User.findOne({ email });
  
//     if (userExists) {
//       res.status(400);
//       throw new Error("Email has already been registered");
//     }
  
//     // Create new user
//     const user = await User.create({
//       uname,
//       mobile,
//       email,
//       password,
//     });
  
//     if (user) {
//       const { _id, uname, email, mobile } = user;
//       res.status(201).json({
//         _id,
//         uname,
//         email,
//         mobile
//       });
//     } else {
//       res.status(400);
//       throw new Error("Invalid user data");
//     }
//   });

const registerUser = async (req, res, next) => {
  const { uname, password, email, mobile } = req.body;

  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      uname,
      password: hash,
      email,
      mobile
    })
      .then((user) =>
        // res.status(200).json({
        //   message: "User successfully created",
        //    user,
        // })
        res.redirect('login')
      )
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};
// --------------------------------------------------------------------
  
  // // Login User
  // const loginUser = asyncHandler(async (req, res) => {
  //   const { uname, password } = req.body;
  
  //   // Validate Request
  //   if (!uname || !password) {
  //     res.status(400);
  //     throw new Error("Please add username and password");
  //   }
  
  //   // Check if user exists
  //   const user = await User.findOne({ uname });
  
  //   if (!user) {
  //     res.status(400);
  //     throw new Error("User not found, please signup");
  //   }
  
  //   // User exists, check if password is correct
  //   const passwordIsCorrect = await bcrypt.compare(password, user.password);
  
  //   if (user && passwordIsCorrect) {
  //     const { _id, uname, email, mobile } = user;
  //     res.status(200).json({
  //       _id,
  //       uname,
  //       email,
  //       mobile
  //     });
  //   } else {
  //     res.status(400);
  //     throw new Error("Invalid username or password");
  //   }
  // });

  const loginUser = async (req, res, next) => {
    const { uname, password } = req.body
    // Check if username and password is provided
    if (!uname || !password) {
      return res.status(400).json({
        message: "Username or Password not present",
      })
    }
    try {
      const user = await User.findOne({ uname })
      if (!user) {
        res.status(400).json({
          message: "Login not successful",
          error: "User not found",
        })
      } else {
        // comparing given password with hashed password
        bcrypt.compare(password, user.password).then(function (result) {
          // return result
          result
            ? 
            res.redirect('/materials')
            // res.status(200).json({
            //     message: "Login successful",
            //     user,
            //   })
            : res.status(400).json({ message: "Login not succesful" })
        })
      }
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      })
    }
  }

// --------------------------------------------------------------------
  // Get User Data
// const getUser = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.user._id);
  
//     if (user) {
//       const { _id, uname, email, mobile } = user;
//       res.status(200).json({
//         _id,
//         uname,
//         email,
//         mobile,
//       });
//     } else {
//       res.status(400);
//       throw new Error("User Not Found");
//     }
//   });

const getUsers = function() {
  return User.find({}).exec();
};

const removeUser = function(id) {
  return User.deleteOne({ _id: id }).then(() => {
    console.log('User deleted successfully');
  }).catch((err) => {
    console.error(err);
    throw err;
  });
};

  module.exports = {
    registerUser,
    loginUser,
    getUsers,
    removeUser
  };