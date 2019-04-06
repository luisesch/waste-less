const express = require("express");
const leagueRoutes = express.Router();
const parser = require("../configs/cloudinary");

const League = require("../models/league");
const User = require("../models/user");

const moment = require("moment");
const templateInvited = require("../templates/templateInvited");
const templateStarted = require("../templates/templateStarted");
const templateEnded = require("../templates/templateEnded");

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

// DELETE /leagues/:leagueID/members/:userID
// POST /leagues/:leagueID/members
// body --> { userID:  }
// GET /leagues/:leagueID/members?ex=true
//

leagueRoutes.post("/deleteMember", (req, res, next) => {
  const memberId = req.body.memberId;

  User.findOneAndUpdate(
    { _id: memberId },
    { $unset: { league: {} }, $set: { score: 0 } },
    { new: true }
  )
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

leagueRoutes.delete("/leagues/:leagueId/delete", (req, res, next) => {
  const leagueId = req.params.leagueId;

  League.findByIdAndDelete(leagueId).then(response => console.log(response));

  User.updateMany(
    { "league.info": leagueId },
    { $set: { score: 0 }, $unset: { league: {} } },
    { new: true }
  )
    .then(response2 => {
      res.status(200).json(response2);
    })
    .catch(err => console.log(err));
});

// create new league
leagueRoutes.post("/leagues", parser.single("picture"), (req, res, next) => {
  const name = req.body.name;
  const duration = req.body.duration;
  const administratorId = req.body.administrator;
  const members = JSON.parse(req.body.members) || []; // because multipart/form-data sends undefined when passed an empty array
  let photo = "";

  if (!req.file) {
    photo = "/images/default_league.png";
  } else {
    let nonRotatedUrlArr = req.file.url.split("/");
    nonRotatedUrlArr.splice(6, 0, "a_exif");
    profilepic = nonRotatedUrlArr.join("/");
    photo = profilePic;
  }

  const aNewLeague = new League({
    name: name,
    administrator: administratorId,
    photo: photo,
    duration: duration
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
    ).then(() => console.log("found"));

    members.forEach(member =>
      User.findOneAndUpdate(
        { username: member },
        { $set: { league: { info: aNewLeague._id, confirmed: false } } },
        { new: true }
      )
        .then(response =>
          transporter.sendMail({
            from: '"waste-less" <waste.less.ironhack@gmail.com>',
            to: response.email,
            subject: "You've been invited to join a league!",
            text: "localhost:3000/myleague",
            html: templateInvited.templateInvited("localhost:3000/myleague")
          })
        )
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
    { $set: { score: 0, league: { info: leagueId, confirmed: false } } },
    { new: true }
  )
    .then(user => {
      transporter.sendMail({
        from: '"waste-less" <waste.less.ironhack@gmail.com>',
        to: user.email,
        subject: "You've been invited to join a league!",
        text: "localhost:3000/myleague",
        html: templateInvited.templateInvited("localhost:3000/myleague")
      });
      res.status(200).json(user);
    })
    .catch(err => console.log(err));
});

// change league picture
leagueRoutes.post(
  "/leagues/:leagueId/pictures",
  parser.single("picture"),
  (req, res, next) => {
    const leagueId = req.params.leagueId;

    let nonRotatedUrlArr = req.file.url.split("/");
    nonRotatedUrlArr.splice(6, 0, "a_exif");
    profilepic = nonRotatedUrlArr.join("/");

    League.findOneAndUpdate(
      { _id: leagueId },
      { photo: profilepic },
      { new: true }
    )
      .populate("administrator")
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => console.log(err));
  }
);

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

leagueRoutes.put("/leagues/:leagueId/start/:duration", (req, res, next) => {
  const leagueId = req.params.leagueId;
  const duration = req.params.duration;
  const startDate = moment().format("L");
  const endDate = moment()
    .add(duration, "day")
    .format("L");

  User.find({ "league.info": leagueId })
    .then(users => {
      let mailList = [];
      users.forEach(user => mailList.push(user.email));
      transporter.sendMail({
        from: '"waste-less" <waste.less.ironhack@gmail.com>',
        to: "waste.less.ironhack@gmail.com",
        bcc: mailList,
        subject: "Your league has just started!",
        text: "localhost:3000/tasks",
        html: templateStarted.templateStarted("localhost:3000/tasks")
      });
    })
    .catch(err => console.log(err));

  League.findOneAndUpdate(
    { _id: leagueId },
    { $set: { status: "active", startDate: startDate, endDate: endDate } },
    { new: true }
  )
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

// if 30 days are over, change status of league to "completed" and move league to completedLeagues Array

leagueRoutes.get("/leagues/checkover", (req, res, next) => {
  League.updateMany(
    { endDate: moment().format("L") },
    { $set: { status: "completed" } }
  );
  League.find({ endDate: moment().format("L") }).then(leagues => {
    leagues.forEach(league => {
      User.find({ "league.info": league._id }).then(users => {
        let mailList = [];
        users.forEach(user => mailList.push(user.email));
        transporter.sendMail({
          from: '"waste-less" <waste.less.ironhack@gmail.com>',
          to: "waste.less.ironhack@gmail.com",
          bcc: mailList,
          subject: "Your league has ended!",
          text: "localhost:3000/archive/" + league._id,
          html: templateEnded.templateEnded(
            "localhost:3000/archive/" + league._id
          )
        });

        Promise.all(
          users.map(user => {
            user.completedLeagues.push({
              info: league._id,
              score: user.score
            });
            user.score = 0;
            return user.save();
          })
        ).then(() => {
          User.update(
            { "league.info": league._id },
            { $unset: { league: {} } }
          ).then(response => res.status(200).json(response));
        });
      });
    });
  });
});

// get one league by ID
leagueRoutes.get("/leagues/:leagueId", (req, res, next) => {
  const leagueId = req.params.leagueId;

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

leagueRoutes.get("/archive/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findById({ _id: userId })
    .populate("completedLeagues.info")
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err));
});

module.exports = leagueRoutes;
