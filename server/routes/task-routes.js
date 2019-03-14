const express = require("express");
const taskRoutes = express.Router();

const User = require("../models/user");

// create new league
taskRoutes.post("/user/score", (req, res, next) => {
  const newScore = req.body.newScore;
  const userId = req.user._id;

  // console.log(newScore, userId);

  // User.findOne({ _id: userId }).then(response => console.log(response));

  User.findOneAndUpdate(
    { _id: userId },
    { $set: { score: newScore } },
    { new: true }
  )
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

module.exports = taskRoutes;
