const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const postsRoutes = require("./services/posts");

const profileRouter = require("./services/profiles");
const experienceRouter = require("./services/experiences");

const server = express();
const port = process.env.PORT || 3002;

server.use(cors());
server.use(express.json());
server.use("/posts", postsRoutes);

server.use("/profile", profileRouter);

server.use("/profile", profileRouter);
server.use("/experience", experienceRouter);

mongoose
  .connect(
    "mongodb+srv://evgeni:test1234@cluster0.0meed.mongodb.net/linkedin?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    server.listen(port, () => {
      console.log("The server's power level is over ", port);
    })
  );
