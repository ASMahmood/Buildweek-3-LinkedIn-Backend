const express = require("express");
const PostModel = require("./schema");
const multer = require("multer");
const postRouter = express.Router();
const cloudinary = require("../../utilities/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "benchmark3",
  },
});
const cloudinaryMulter = multer({ storage: storage });
//working
postRouter.post("/", async (req, res) => {
  try {
    const newPost = new PostModel(req.body);
    const { _id } = await newPost.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    res.send("Somethings gone wrong");
  }
});
//working
postRouter.get("/", async (req, res) => {
  try {
    const allPosts = await PostModel.find().populate("comments").populate("user_id");
    res.status(201).send(allPosts);
  } catch (error) {
    console.log(error);
    res.send("Somethings gone wrong");
  }
});
//working
postRouter.get("/:id", async (req, res) => {
  try {
    const allPosts = await PostModel.findById(req.params.id) .populate({ 
      path: 'comments',
      populate: {
        path: 'user_id',
        model: 'Profiles'
      } 
   }).populate("user_id")
    res.status(201).send(allPosts);
  } catch (error) {
    console.log(error);
    res.send("Somethings gone wrong");
  }
});
//wroking
postRouter.delete("/:id", async (req, res) => {
  try {
    const elementToDelete = await PostModel.findByIdAndDelete(req.params.id);
    res.status(201).send("This element is deleted ->" + elementToDelete);
  } catch (error) {
    console.log(error);
    res.send("Somethings gone wrong");
  }
});
//wroking
postRouter.put("/:id", async (req, res) => {
  try {
    const elementToUpdate = await PostModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(201).send("This element was updated ->" + elementToUpdate);
  } catch (error) {
    console.log(error);
    res.send("Somethings gone wrong");
  }
});

//POST A PICTURE
postRouter.post(
  "/:id/picture",
  cloudinaryMulter.single("postPic"),
  async (req, res, next) => {
    try {
      const updatedPost = await PostModel.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        { runValidators: true, new: true }
      );
      res.send(updatedPost);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

//LIKE POST
postRouter.put("/:id/like/:profileID", async (req, res, next) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $push: { likes: req.params.profileID } },
      { runValidators: true, new: true }
    );
    res.send("liked");
  } catch (error) {
    next(error);
  }
});

//UNLIKE POST
postRouter.put("/:id/unlike/:profileID", async (req, res, next) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.params.profileID } },
      { runValidators: true, new: true }
    );
    res.send("unliked");
  } catch (error) {
    next(error);
  }
});


module.exports = postRouter;
