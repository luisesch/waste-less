const express = require("express");
const userRoutes = express.Router();

const User = require("../models/user");

// get all users
userRoutes.get("/users", (req, res, next) => {
  User.find()
    .then(allUser => {
      res.status(200).json(allUsers);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = userRoutes;
