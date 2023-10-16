const authController = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

authController.post(
  "/register",
  // upload.single("img"),
  async (req, res) => {
    const {
      username,
      email,
      password,
      profileImg,
     
    } = req.body;
      console.log("hellooo");

    // console.log("backend image>>>>>>>>>>>>.", profileImg);
    try {
      const isExisting = await User.findOne({ email: email });
      if (isExisting) {
        return res
          .status(500)
          .json({ msg: "Email is already taken by another user." });
      }
      console.log("backend22222222222222222222");
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const result = await cloudinary.uploader.upload(
        profileImg,
        {
          resource_type: "image",
        },
       async (error, result) => {
          if (error) {
            console.log("Cloudinary Error:", error);
            return res.status(500).json(error);
          }
          console.log("backend333333333333333");

          const cloudinaryUrl = result.secure_url;
          console.log("cloudurlll", cloudinaryUrl);

          const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            profileImg: cloudinaryUrl,
          });
           const { password, ...others } = newUser._doc;
           const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
             expiresIn: "35d",
           });
           return res.status(201).json({ others, token });

        }
      );
      

    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json(error);
    }
  }
);

// authController.post("/register", async (req, res) => {
//   try {
//     const isExisting = await User.findOne({ email: req.body.email });

//     if (isExisting) {
//       return res
//         .status(500)
//         .json({ msg: "Email is already taken by another user." });
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);

//     const newUser = await User.create({
//       ...req.body,
//       password: hashedPassword,
//     });

//     const { password, ...others } = newUser._doc;
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "35d",
//     });

//     return res.status(201).json({ others, token });
//   } catch (error) {
//     return res.status(500).json(error.message);
//   }
// });

authController.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(500).json({ msg: "Wrong credentials. Try again!" });
    }

    const comparePass = await bcrypt.compare(req.body.password, user.password);
    if (!comparePass) {
      return res.status(500).json({ msg: "Wrong credentials. Try again!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    const { password, ...others } = user._doc;
    console.log({ others, token });
    return res.status(200).json({ others, token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = authController;
