const verifyToken = require("../middlewares/verifyToken");
const Property = require("../models/Property");
const User = require("../models/User");
const cloudinary = require('../utils/cloudinary')
const propertyController = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// get all properties
propertyController.get("/getAll", async (req, res) => {
  try {
    const properties = await Property.find({ featured: true }).populate(
      "currentOwner",
      "-password"
    );
    return res.status(200).json(properties);
  } catch (error) {
    console.error(error);
  }
});

// get featured
propertyController.get("/find/featured", async (req, res) => {
  try {
    // console.log("1122");
    const featuredProperties = await Property.find({ featured: true }).populate(
      "currentOwner",
      "-password"
    );
    // console.log(featuredProperties);
    return res.status(200).json(featuredProperties);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// get all from property-type
propertyController.get("/find", async (req, res) => {
  const type = req.query;
  let properties = [];
  try {
    if (type) {
      properties = await Property.find(type).populate("owner", "-password");
    } else {
      properties = await Property.find({});
    }

    return res.status(200).json(properties);
  } catch (error) {
    return res.status(500).json(error);
  }
});
propertyController.get("/find/types", async (req, res) => {
  try {

    const rentalType = await Property.countDocuments({ type: "rental" });
    const tokenizedType = await Property.countDocuments({ type: "tokenized" });
    const fullType = await Property.countDocuments({ type: "full" });
    return res.status(200).json({
      rental: rentalType,
      tokenized: tokenizedType,
      full: fullType,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});
// Specific users
// propertyController.get("/find/user/:name", async (req, res) => {
//   try {
//     console.log("111111111111");

//     const rentalType = await Property.countDocuments({ type: "rental" });
//     const tokenizedType = await Property.countDocuments({ type: "tokenized" });
//     const fullType = await Property.countDocuments({ type: "full" });
//     console.log("22222222222");
//     return res.status(200).json({
//       rental: rentalType,
//       tokenized: tokenizedType,
//       full: fullType,
//     });
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });

// TODO FETCH INDIVIDUAL PROPERTY
propertyController.get("/find/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "currentOwner",
      "-password"
    );

    if (!property) {
      throw new Error("No such property with that id");
    } else {
      return res.status(200).json(property);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// create estate
propertyController.post(
  "/",
  verifyToken,
  // upload.single("img"),
  async (req, res) => {
    const {
      title,
      type,
      desc,
      price,
      sqmeters,
      img,
      city,
      address,
      baths,
      rooms,
      featured,
    } = req.body;
    console.log("backend image>>>>>>>>>>>>.",req.body.img)

    try {
     
      console.log("backend22222222222222222222")
      const result = await cloudinary.uploader.upload(
        req.body.img,
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

          const newProperty = await Property.create({
            title,
            type,
            desc,
            img: cloudinaryUrl,
            price,
            sqmeters,
            city,
            address,
            baths,
            rooms,
            featured,
            currentOwner: req.user.id,
          });

          return res.status(201).json(newProperty);
        }
      );
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json(error);
    }
  }
);


// update estate
propertyController.put("/:id", verifyToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property.owner.toString() !== req.user.id.toString()) {
      throw new Error("You are not allowed to update other people properties");
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    return res.status(200).json(updatedProperty);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// delete estate
// propertyController.delete("/:id", async (req, res) => {
//   const property = await Property.findByIdAndDelete(req.params.id);
   
//   if (!property) {
//     return res.status(500).json({
//       success: false,
//       message: "property not found",
//     });
//   }

//   res.status(200).json({
//     success: true,
//     message: "property deleted ",
//   });
// });
propertyController.delete("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    return res.status(200).json(property);
  } catch (error) {
    console.error(error);
  }
});

module.exports = propertyController;
