const { Schema, model } = require("mongoose");
const PostsSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Profiles",
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    image: {
      type: String,
      required: true, // set default
    },
  },
  { timestamps: true }
);

const PostModel = model("Posts", PostsSchema);
module.exports = PostModel;
