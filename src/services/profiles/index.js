const express = require("express");
const ProfileModel = require("./schema");

const profileRouter = express.Router();

profileRouter.post("/", async (req, res, next) => {
  try {
    const profileWithImage = {
      ...req.body,
      image:
        "https://res.cloudinary.com/dhmw620tl/image/upload/v1611568491/benchmark3/default-profile.png",
    };
    const newProfile = new ProfileModel(profileWithImage);
    const savedProfile = await newProfile.save();
    res.status(201).send(savedProfile);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = profileRouter;
