const express = require("express");
const leagueRoutes = express.Router();

const League = require("../models/league");

leagueRoutes.post("/leagues", (req, res, next) => {
  const name = req.body.name;
  const administrator = req.body.administrator;

  const aNewLeague = new League({
    name: name,
    administrator: administrator
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
