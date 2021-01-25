const { Schema, model } = require("mongoose");
const CommentsSchema = new Schema(
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
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CommentModel = model("Comments", CommentsSchema);
module.exports = CommentModel;
