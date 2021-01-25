const express = require("express");
const ExperienceModel = require("./schema");
const multer = require("multer");

const experienceRouter = express.Router();

const cloudinary = require("../../utilities/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "benchmark3",
  },
});
const cloudinaryMulter = multer({ storage: storage });

//POST 🚀
experienceRouter.post("/", async (req, res, next) => {
  try {
    const experienceWithImage = {
      ...req.body,
      image:
        "https://res.cloudinary.com/dhmw620tl/image/upload/v1611568491/benchmark3/default-profile.png",
    };
    const newExperience = new ExperienceModel(experienceWithImage);
    const savedExperience = await newExperience.save();
    res.status(201).send(savedExperience);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//GET ALL 💯
experienceRouter.get("/", async (req, res, next) => {
  try {
    const allExperiences = await ExperienceModel.find();
    res.send(allExperiences);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
// GET by 🆔
experienceRouter.get("/:id", async (req, res, next) => {
  try {
    const singleExperience = await ExperienceModel.findById(req.params.id);
    if (singleExperience) {
      res.send(singleExperience);
    } else {
      res
        .status(404)
        .send(`You Monkey,there's no Experience with this ID ${req.params.id}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//DELETE  ☠️
experienceRouter.delete("/:id", async (req, res) => {
  try {
    const deletedExperience = await ExperienceModel.findByIdAndDelete(
      req.params.id
    );
    if (deletedExperience) {
      res.send("Experience is gone, git gud");
    } else {
      res.status(404).send("Deletion Failed, Please Try Again");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//PUT 🛠️
experienceRouter.put("/:id", async (req, res) => {
  try {
    const updatedExperience = await ExperienceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );
    if (updatedExperience) {
      res.send(updatedExperience);
    } else {
      res
        .status(404)
        .send(
          "Bruh, there's no experience with this ID in the Database. Wake up Monkey!"
        );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//POST PICTURE 📷
experienceRouter.post(
  "/:id/picture",
  cloudinaryMulter.single("profilePic"),
  async (req, res, next) => {
    try {
      const updatedExperience = await ExperienceModel.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        { runValidators: true, new: true }
      );
      res.send(updatedExperience);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);
module.exports = experienceRouter;
