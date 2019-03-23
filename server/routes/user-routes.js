const express = require("express");
const userRoutes = express.Router();
const parser = require("../configs/cloudinary")

const User = require("../models/user");

// get all users
userRoutes.get("/users", (req, res, next) => {
  User.find()
    .then(allUsers => {
      res.status(200).json(allUsers);
    })
    .catch(err => {
      res.json(err);
    });
});

userRoutes.post('/users/:userId/pictures', parser.single('picture'), (req, res, next) => {
  const userId = req.params.userId;
  User.findOneAndUpdate({_id: userId}, { photo: req.file.url })
    .then(() => {
      res.json({
        success: true,
        photo: req.file.url
      })
    })
});

module.exports = userRoutes;
