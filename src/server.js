const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const postsRoutes = require("./services/posts");
const commentsRouter = require("./services/comments");
const profileRouter = require("./services/profiles");
const experienceRouter = require("./services/experiences");

const server = express();
const port = process.env.PORT || 3002;

server.use(cors());
server.use(express.json());

server.use("/post", postsRoutes);
server.use("/comment", commentsRouter);
server.use("/profile", profileRouter);
server.use("/experience", experienceRouter);

mongoose.connect(process.env.MONGO_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("The server's power level is over ", port);
    })
  );
