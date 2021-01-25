const express = require("express");
const ExperienceModel = require("./schema");

const experienceRouter = express.Router();

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

experienceRouter.get("/", async (req, res, next) => {
  try {
    const allExperiences = await ExperienceModel.find();
    res.send(allExperiences);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

experienceRouter.get("/:id", async (req, res, next) => {
  try {
    const singleExperience = await ExperienceModel.findById(req.params.id);
    if (singleExperience) {
      res.send(singleExperience);
    } else {
      res
        .status(404)
        .send(`We cannot find a experience with the id: ${req.params.id}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = experienceRouter;
