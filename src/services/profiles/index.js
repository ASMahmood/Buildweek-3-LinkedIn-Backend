const express = require("express");
const ProfileModel = require("./schema");
const multer = require("multer");

const profileRouter = express.Router();

const cloudinary = require("../../utilities/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "benchmark3",
  },
});
const cloudinaryMulter = multer({ storage: storage });

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

profileRouter.get("/", async (req, res, next) => {
  try {
    const allProfiles = await ProfileModel.find();
    res.send(allProfiles);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

profileRouter.get("/:id", async (req, res, next) => {
  try {
    const singleProfile = await ProfileModel.findById(req.params.id);
    if (singleProfile) {
      res.send(singleProfile);
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

profileRouter.put("/:id", async (req, res, next) => {
  try {
    const alteredProfile = await ProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );
    if (alteredProfile) {
      res.send(alteredProfile);
    } else {
      res
        .status(404)
        .send(
          "The profile you would like to edit cannot be found inside our database. Bitch."
        );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

profileRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedProfile = await ProfileModel.findByIdAndDelete(req.params.id);
    if (deletedProfile) {
      res.send("Profile successfully executed");
    } else {
      res.status(404).send("Profile escaped before we could execute it.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

profileRouter.post(
  "/:id/picture",
  cloudinaryMulter.single("profilePic"),
  async (req, res, next) => {
    try {
      const alteredProfile = await ProfileModel.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        { runValidators: true, new: true }
      );
      res.send(alteredProfile);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

module.exports = profileRouter;
