const express = require("express");
const leagueRoutes = express.Router();

const League = require("../models/league");
const User = require("../models/user");

// get one league by ID
leagueRoutes.get("/leagues/:userId", (req, res, next) => {
  const userId = req.params.userId;
  League.findById(userId)
    .then(league => {
      res.status(200).json(league);
    })
    .catch(err => {
      res.json(err);
    });
});

leagueRoutes.post("/members", (req, res, next) => {
  const leagueId = req.body.leagueId;

  League.findById(leagueId)
    .populate("members.info")
    .exec((err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(response.members);
      }
    });
});

leagueRoutes.post("/deleteMember", (req, res, next) => {
  const memberId = req.body.memberId;
  const leagueId = req.body.leagueId;

  League.findOneAndUpdate(
    { _id: leagueId },
    { $pull: { members: { info: memberId } } },
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
    administrator: administratorId,
    members: members
  });

  // console.log("newLeague:", aNewLeague);

  aNewLeague.save(err => {
    if (err) {
      res
        .status(400)
        .json({ message: "Saving league to database went wrong." });
      return;
    }

    User.findOneAndUpdate(
      { _id: administratorId },
      { $set: { league: aNewLeague._id } },
      { new: true }
    ).then(response => console.log(response));

    // Send the team's information to the frontend
    res.status(200).json(aNewLeague);
  });
});

leagueRoutes.post("/addMember", (req, res, next) => {
  const userId = req.body.userId;
  const leagueId = req.body.leagueId;

  League.findOneAndUpdate(
    { _id: leagueId },
    { $push: { members: { info: userId, confirmed: false } } },
    { new: true }
  ).then(response => res.status(200).json(response));
});

module.exports = leagueRoutes;
