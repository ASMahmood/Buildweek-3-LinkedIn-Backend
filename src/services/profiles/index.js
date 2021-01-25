const express = require("express");
const ProfileModel = require("./schema");

const profileRouter = express.Router();

profileRouter.post("/", async (req, res, next) => {
  try {
    const profileWithImage = { ...req.body };
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = profileRouter;
