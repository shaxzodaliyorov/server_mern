const express = require("express");
const authModel = require("../Model/authModel");
const router = express.Router();
const bcrypt = require("bcryptjs");
const fs = require("fs");
const multer = require('multer')

const imgConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `img-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: imgConfig });

// REGISTER
router.post("/register", upload.single("profilepic"), async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const { filename } = req.file;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const FindEmail = await authModel.findOne({ email });
    if (FindEmail) {
      return res.json({ user: true });
    }
    const User = await authModel({
      firstname,
      lastname,
      email,
      password: hashPassword,
      profilepic: {
        data: fs.readFileSync("uploads/" + filename),
        ContentType: "image/png/jpg/jpeg",
      },
    });
    await User.save();
    res.status(200).json(User);
  } catch (error) {
    res.status(500).json(error);
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findEmail = await authModel.findOne({ email });
    if (!findEmail) {
      return res.json({ login: true });
    }
    const result = await bcrypt.compare(password, findEmail.password);
    if (result) {
      res.status(200).json(findEmail);
    } else {
      res.status(500).json({ user: true });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
