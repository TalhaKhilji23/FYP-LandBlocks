const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    currentOwner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 6,
    },
    type: {
      type: String,
      enum: ["rental", "tokenized", "full"],
      required: true,
    },
    desc: {
      type: String,
      required: true,
      min: 50,
    },
    img: {
      // public_id : {
      //   type : String,
      //   required : true

      // },
      // url : {
      //   type : String,
      //   required : true

      // }
      type: String,
    },
    price: {
      type: Number,
      float: true,
      required: true,
    },
    sqmeters: {
      type: Number,
      required: true,
      float: true,
      min: 15,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
      min: 1,
    },
    rooms: {
      type: Number,
      required: true,
      min: 1,
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
