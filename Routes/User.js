const express = require("express");
const authModel = require("../Model/authModel");
const PostModel = require("../Model/PostModel");
const router = express.Router();
// get all user

router.get("/all", async (req, res) => {
  const users = await authModel.find({});
  try {
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

//  get user
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await authModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(user);
    } else {
      res.status(403).json("error");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// update
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, email, profilepic } = req.body;
  const FindEmail = await authModel.findOne({ email });
  if (FindEmail) {
    return res.status(403).json("email exits error");
  }
  try {
    const update = await authModel.findByIdAndUpdate(id, {
      firstname,
      lastname,
      email,
      profilepic,
    });
    res.status(200).json({ ms: update, ok: "ok" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id/follow", async (req, res) => {
  const { UserId } = req.body;
  const id = req.params.id;
  if (UserId === id) {
    res.status(403).json("action");
  } else {
    try {
      const followUser = await authModel.findById(id);
      const followingUser = await authModel.findById(UserId);

      if (!followUser.Followers.includes(UserId)) {
        await followUser.updateOne({ $push: { Followers: UserId } });
        await followingUser.updateOne({ $push: { Following: id } });
        res.status(200).json({ data: followingUser, ms: "followed" });
      } else if (followUser.Followers.includes(UserId)) {
        await followUser.updateOne({ $pull: { Followers: UserId } });
        await followingUser.updateOne({ $pull: { Following: id } });
        res.status(200).json({ data: followingUser, ms: "followed" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

router.get("/following/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const follow = await authModel.findById({ _id: id });
    const followingUser = await authModel.find({ _id: follow.Followers });
    res.status(200).json(followingUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/followers/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const follow = await authModel.findById({ _id: id });
    const followingUser = await authModel.find({ _id: follow.Following });
    res.status(200).json(followingUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
