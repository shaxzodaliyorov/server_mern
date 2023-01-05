const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Following: {
    type: Array,
    default: [],
  },
  Followers: {
    type: Array,
    default: [],
  },
  profilepic: {
    data: Buffer,
    ContentType: String,
  },
  posts: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("auth", AuthSchema);
