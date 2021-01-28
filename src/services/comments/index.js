const express = require("express");
const CommentModel = require("./schema");
const multer = require("multer");
const PostModel = require("../posts/schema")

const commentRouter = express.Router();

const cloudinary = require("../../utilities/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "benchmark3",
  },
});
const cloudinaryMulter = multer({ storage: storage });

commentRouter.post("/", async (req, res, next) => {
  try {
    const newcomment = new CommentModel({ ...req.body, image: "default" });
    const savedcomment = await newcomment.save();
    await PostModel.addCommentToPost(
      savedcomment._id,
      req.body.post_id
    );
    res.status(201).send(savedcomment);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

commentRouter.get("/", async (req, res, next) => {
  try {
    const allcomments = await CommentModel.find().populate("user_id");
    res.send(allcomments);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

commentRouter.get("/:id", async (req, res, next) => {
  try {
    const singlecomment = await CommentModel.findById(req.params.id).populate(
      "user_id"
    );
    if (singlecomment) {
      res.send(singlecomment);
    } else {
      res
        .status(404)
        .send(`We cannot find a user with the id: ${req.params.id}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

commentRouter.put("/:id", async (req, res, next) => {
  try {
    const alteredcomment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );
    if (alteredcomment) {
      res.send(alteredcomment);
    } else {
      res
        .status(404)
        .send(
          "The comment you would like to edit cannot be found inside our database. Bitch."
        );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

commentRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedcomment = await CommentModel.findByIdAndDelete(req.params.id);
    if (deletedcomment) {
      res.send("comment successfully executed");
    } else {
      res.status(404).send("comment escaped before we could execute it.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

commentRouter.post(
  "/:id/picture",
  cloudinaryMulter.single("commentPic"),
  async (req, res, next) => {
    try {
      const alteredcomment = await CommentModel.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        { runValidators: true, new: true }
      );
      res.send(alteredcomment);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

module.exports = commentRouter;
