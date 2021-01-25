const express = require("express");
const PostModel = require("./schema");

const postRouter = express.Router();
//working
postRouter.post("/", async (req, res) => {
    try {
      const newPost = new PostModel(req.body);
      const { _id } = await newPost.save();
      res.status(201).send(_id);
    } catch (error) {
      console.log(error);
      res.send("Somethings gone wrong");
    }
  })
  //working
  postRouter.get("/", async (req, res) => {
    try {
      const allPosts = await PostModel.find()
      res.status(201).send(allPosts);
    } catch (error) {
      console.log(error);
      res.send("Somethings gone wrong");
    }
  });
//working
  postRouter.get("/:id", async (req, res) => {
    try {
      const allPosts = await PostModel.findById(req.params.id)
      res.status(201).send(allPosts);
    } catch (error) {
      console.log(error);
      res.send("Somethings gone wrong");
    }
  });
  //wroking
  postRouter.delete("/:id", async (req, res) => {
    try {
      const elementToDelete = await PostModel.findByIdAndDelete(req.params.id)
      res.status(201).send("This element is deleted ->" + elementToDelete);
    } catch (error) {
      console.log(error);
      res.send("Somethings gone wrong");
    }
  });
    //wroking
  postRouter.put("/:id", async (req, res) => {
    try {
      const elementToUpdate = await PostModel.findByIdAndUpdate(req.params.id,req.body)
      res.status(201).send("This element was updated ->" + elementToUpdate);
    } catch (error) {
      console.log(error);
      res.send("Somethings gone wrong");
    }
  });
module.exports = postRouter;
