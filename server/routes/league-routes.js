const express = require("express");
const leagueRoutes = express.Router();

const League = require("../models/league");
const User = require("../models/user");

const moment = require("moment");

// get one league by ID
leagueRoutes.get("/leagues/:leagueId", (req, res, next) => {
  // console.log("getting league");
  console.log(moment().format("MMM Do YY"));
  const leagueId = req.params.leagueId;
  // console.log(req.params.leagueId);

  League.findById(leagueId)
    .populate("administrator")
    .exec((err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(response);
      }
    });
});

leagueRoutes.post("/deleteMember", (req, res, next) => {
  const memberId = req.body.memberId;

  User.findOneAndUpdate(
    { _id: memberId },
    { $unset: { league: {} } },
    { new: true }
  )
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

// create new league
leagueRoutes.post("/leagues", (req, res, next) => {
  const name = req.body.name;
  const administratorId = req.body.administrator;
  const members = req.body.members;

  // console.log("members:", members);

  const aNewLeague = new League({
    name: name,
    administrator: administratorId
  });

  aNewLeague.save(err => {
    if (err) {
      res
        .status(400)
        .json({ message: "Saving league to database went wrong." });
      return;
    }

    User.findOneAndUpdate(
      { _id: administratorId },
      { $set: { league: { info: aNewLeague._id, confirmed: true } } },
      { new: true }
    ).then(response => console.log(response));

    members.forEach(member =>
      User.findOneAndUpdate(
        { _id: member.info },
        { $set: { league: { info: aNewLeague._id, confirmed: false } } },
        { new: true }
      )
        .then(response => console.log(response))
        .catch(err => console.log(err))
    );

    // Send the team's information to the frontend
    res.status(200).json(aNewLeague);
  });
});

leagueRoutes.post("/addMember", (req, res, next) => {
  const userId = req.body.userId;
  const leagueId = req.body.leagueId;

  User.findOneAndUpdate(
    { _id: userId },
    { $set: { league: { info: leagueId, confirmed: false } } },
    { new: true }
  )
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

//get members
leagueRoutes.get("/leagues/:leagueId/members", (req, res, next) => {
  const leagueId = req.params.leagueId;
  User.find({ "league.info": leagueId })
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

//get ex-members
leagueRoutes.get("/leagues/:leagueId/exmembers", (req, res, next) => {
  const leagueId = req.params.leagueId;
  User.find({ "completedLeagues.info": leagueId })
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

// enter league
leagueRoutes.put("/leagues/:leagueId/enterLeague/:userId", (req, res, next) => {
  const userId = req.params.userId;
  const leagueId = req.params.leagueId;

  User.findOneAndUpdate(
    { _id: userId },
    { $set: { league: { info: leagueId, confirmed: true } } },
    { new: true }
  )
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

leagueRoutes.put("/leagues/:leagueId/start", (req, res, next) => {
  const leagueId = req.params.leagueId;
  const startDate = moment().format("L");
  const endDate = moment()
    .add(30, "day")
    .format("L");

  League.findOneAndUpdate(
    { _id: leagueId },
    { $set: { status: "active", startDate: startDate, endDate: endDate } },
    { new: true }
  )
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

// if 30 days are over, change status of league to "completed" and move league to completedLeagues Array
leagueRoutes.put("/leagues/:leagueId/end", (req, res, next) => {
  const leagueId = req.params.leagueId;

  League.findOneAndUpdate(
    { _id: leagueId },
    { $set: { status: "completed" } },
    { new: true }
  ).then(response => {
    User.find({ "league.info": leagueId }).then(users =>
      Promise.all(
        users.map(user => {
          user.completedLeagues.push({ info: leagueId, score: user.score });
          return user.save();
        })
      ).then(() => {
        res.status(200).json(response);
      })
    );
  });
});

leagueRoutes.get("/archive/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findById({ _id: userId })
    .populate("completedLeagues.info")
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

module.exports = leagueRoutes;
