const express = require("express");
const postModel = require("../Model/PostModel");
const authModel = require("../Model/authModel");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
const { default: mongoose } = require("mongoose");
// multer
const imgConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `img-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: imgConfig,
  limits: {
    fields: Infinity,
  },
});

router.post("/add", upload.single("img"), async (req, res) => {
  const { title, disc, userid } = req.body;
  const { filename } = req.file;
  try {
    const userId = await authModel.findById({ _id: userid });
    if (title && disc && userid && filename) {
      const Post = postModel({
        title,
        disc,
        userid,
        img: {
          data: fs.readFileSync("uploads/" + filename),
          ContentType: "image/png/jpg/jpeg",
        },
        pic: userId.profilepic,
        auth: userId.email,
      });
      await Post.save();
      res.json(Post);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// get post
router.get("posts/:id", async (req, res) => {
  try {
    const GetId = req.params.id;
    const UserId = await postModel.findById(GetId);
    res.status(200).json(UserId);
  } catch (error) {
    res.status(500).json(error);
  }
});
// update post
router.put("/update/:id", async (req, res) => {
  const postId = req.params.id;
  const { userid } = req.body;
  try {
    const post = await postModel.findById(postId);
    if (post.userid === userid) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post update");
    } else {
      res.status(403).json("acction post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// delte post
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userid } = req.body;
    console.log(userid);
    const postId = await postModel.findById({ _id: id });
    if (postId.userid === userid) {
      await postId.deleteOne();
      res.status(200).json("delete post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// like post
router.put("/like/:id", async (req, res) => {
  const id = req.params.id;
  const { userid } = req.body;
  try {
    const post = await postModel.findById(id);
    if (!post.like.includes(userid)) {
      await post.updateOne({ $push: { like: userid } });
      res.status(200).json({ like: true });
    } else {
      await post.updateOne({ $pull: { like: userid } });
      res.status(200).json({ like: false });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get my posts
router.get("/my/:id", async (req, res) => {
  const id = req.params.id;
  const myPosts = await postModel.find({ userid: id });
  res.status(200).json(
    myPosts.sort((a, b) => {
      return b.createdAt - a.updatedAt;
    })
  );
});

// default te post
router.get("/get", async (req, res) => {
  const currentUserIdPost = await postModel.find();
  try {
    res.status(200).json(
      currentUserIdPost.sort((a, b) => {
        return b.createdAt - a.updatedAt;
      })
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
