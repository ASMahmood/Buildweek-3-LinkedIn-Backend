const { Schema, model } = require("mongoose");

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
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    experiences: [{ type: Schema.Types.ObjectId, ref: "Experiences" }],
  },
  { timestamps: true }
);

ProfileSchema.static(
  "addExperienceToProfile",
  async function (experienceID, profileID) {
    await ProfileModel.findByIdAndUpdate(
      profileID,
      { $push: { experiences: experienceID } },
      { runValidators: true, new: true }
    );
  }
);

const ProfileModel = model("Profiles", ProfileSchema);

module.exports = ProfileModel;
