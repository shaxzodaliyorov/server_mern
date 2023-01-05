const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    disc: {
      type: String,
    },
    like: {
      type: Array,
      default: [],
    },
    userid: {
      type: String,
      required: true,
    },
    img: { data: Buffer, ContentType: String },
    pic: {
      data: Buffer,
      ContentType: String,
    },
    auth: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("postModel", PostSchema);
