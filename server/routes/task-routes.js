const express = require("express");
const taskRoutes = express.Router();

const User = require("../models/user");
const CompletedTask = require("../models/completedTask");

// create new league
taskRoutes.post("/user/completeTask", (req, res, next) => {
  const newScore = req.body.newScore;
  const userId = req.user._id;
  const task = JSON.parse(req.body.task);

  const newCompletedTask = new CompletedTask({
    user: userId,
    league: req.user.league.info,
    task: task
  });

  newCompletedTask.save();

  User.findOneAndUpdate(
    { _id: userId },
    { $set: { score: newScore } },
    { new: true }
  )
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

//get members
taskRoutes.get("/tasks/league/:leagueId", (req, res, next) => {
  const leagueId = req.params.leagueId;
  CompletedTask.find({ league: leagueId })
    .populate("user")
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

taskRoutes.get("/tasks/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  CompletedTask.find({ user: userId })
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

module.exports = taskRoutes;
