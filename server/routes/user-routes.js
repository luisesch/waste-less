const express = require("express");
const userRoutes = express.Router();

const User = require("../models/user");

// get all users
userRoutes.get("/users", (req, res, next) => {
  User.find()
    .then(allLeagues => {
      res.status(200).json(allLeagues);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = userRoutes;
