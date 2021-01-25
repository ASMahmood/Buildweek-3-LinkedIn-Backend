const { Schema, model } = require("mongoose");
const profileRouter = require(".");

const ProfileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    experiences: [{ type: Schema.Types.ObjectId, ref: "Experiences" }],
  },
  { timestamps: true }
);

ProfileSchema.static(
  "addExperienceToProfile",
  async function (experienceID, profileID) {
    await ProfileModel.findByIdAndUpdate(
      experienceID,
      { $push: { experiences: profileID } },
      { runValidators: true, new: true }
    );
  }
);

const ProfileModel = model("Profiles", ProfileSchema);

module.exports = ProfileModel;
