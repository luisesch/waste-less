const express = require("express");
const userRoutes = express.Router();
const parser = require("../configs/cloudinary");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const templateNewInvited = require("../templates/templateNewInvited");

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

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

userRoutes.post("/users/invite", (req, res, next) => {
  // req.logout() is defined by passport
  const email = req.body.email;
  const invitedBy = req.body.invitedBy;

  const mail = {
    from: '"waste-less" <waste.less.ironhack@gmail.com>',
    to: email,
    subject: invitedBy + " has invited you to join waste-less",
    text: "https://waste-less.herokuapp.com/myleague",
            html: templateNewInvited.templateNewInvited("https://waste-less.herokuapp.com/myleague")
   
    
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err);
      res.json({
        msg: "fail"
      });
    } else {
      res.json({
        msg: "success"
      });
    }
  });
});

userRoutes.post(
  "/users/:userId/pictures",
  parser.single("picture"),
  (req, res, next) => {
    const userId = req.params.userId;

    let nonRotatedUrlArr = req.file.url.split("/");
    nonRotatedUrlArr.splice(6, 0, "a_exif");
    profilepic = nonRotatedUrlArr.join("/");

    User.findOneAndUpdate({ _id: userId }, { photo: profilepic }, { new: true })
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => console.log(err));
  }
);

userRoutes.put("/users/:userId/edit/:attribute/:value", (req, res, next) => {
  const userId = req.params.userId;
  const attribute = req.params.attribute;
  const value = req.params.value;

  if (attribute === "password") {
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(value, salt);

    User.findOneAndUpdate(
      { _id: userId },
      { password: hashPass },
      { new: true }
    )
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => console.log(err));
  } else {
    User.findOneAndUpdate(
      { _id: userId },
      { [attribute]: value },
      { new: true }
    )
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => console.log(err));
  }
});

userRoutes.get("/users/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .populate("league.info")
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = userRoutes;
