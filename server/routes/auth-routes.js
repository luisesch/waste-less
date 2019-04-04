const express = require("express");
const authRoutes = express.Router();

const passport = require("passport");
const bcrypt = require("bcryptjs");

// require the user model !!!!
const User = require("../models/user");

const templateVerification = require("../templates/templateVerification");

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let confirmationCode = "";
  for (let i = 0; i < 25; i++) {
    confirmationCode +=
      characters[Math.floor(Math.random() * characters.length)];
  }

  if (!username || !password) {
    res.status(200).json({ message: "Provide username and password" });
    return;
  }

  if (password.length < 7) {
    res.status(200).json({
      message:
        "Please make your password at least 8 characters long for security purposes."
    });
    return;
  }

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: "Username check went bad." });
      return;
    }

    if (foundUser) {
      res.status(200).json({ message: "Username taken. Choose another one." });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
      username: username,
      password: hashPass,
      email: email,
      confirmationCode: confirmationCode
    });

    aNewUser.save(err => {
      if (err) {
        res
          .status(400)
          .json({ message: "Saving user to database went wrong." });
        return;
      }

      transporter
        .sendMail({
          from: '"waste-less" <waste.less.ironhack@gmail.com>',
          to: email,
          subject: "Please verify your email address!",
          text: "localhost:3000/confirm/" + confirmationCode,
          html: templateVerification.templateVerification(
            "localhost:3000/confirm/" + confirmationCode
          )
        })
        .then(() => {
          req.login(aNewUser, err => {
            if (err) {
              res.status(500).json({ message: "Login after signup went bad." });
              return;
            }

            // Send the user's information to the frontend
            // We can use also: res.status(200).json(req.user);
            res.status(200).json(aNewUser);
          });
        })
        .catch(error => {
          next(error);
        });
    });
  });
});

authRoutes.put("/auth/:userId/confirm/:code", (req, res) => {
  confirmationCode = req.params.code;
  User.findOneAndUpdate(
    { confirmationCode: confirmationCode },
    { $set: { status: "Active" } },
    { new: true }
  )
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => console.log(err));
});

authRoutes.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong authenticating user" });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(200).json({
        message: "Username doesn't exist."
      });
      return;
    }

    // save user in session
    req.login(theUser, err => {
      if (err) {
        res.status(500).json({ message: "Session save went bad." });
        return;
      }

      // We are now logged in (that's why we can also send req.user)
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

authRoutes.post("/logout", (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: "Log out success!" });
});

authRoutes.get("/loggedin", (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  } else {
    //res.send('')
    //res.status(403).json({ message: "Unauthorized" });
    res.json(false);
  }
});

module.exports = authRoutes;
