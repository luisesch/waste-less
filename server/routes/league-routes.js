const express = require("express");
const leagueRoutes = express.Router();

const League = require("../models/league");

// create new league
leagueRoutes.post("/leagues", (req, res, next) => {
  const name = req.body.name;
  const administrator = req.body.administrator;
  const members = req.body.members;

  const aNewLeague = new League({
    name: name,
    administrator: administrator,
    members: members
  });

  aNewLeague.save(err => {
    if (err) {
      res
        .status(400)
        .json({ message: "Saving league to database went wrong." });
      return;
    }

    // Send the team's information to the frontend
    res.status(200).json(aNewLeague);
  });
});

module.exports = leagueRoutes;
