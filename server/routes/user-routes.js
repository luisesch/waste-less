const express = require("express");
const userRoutes = express.Router();
const parser = require("../configs/cloudinary");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

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

module.exports = userRoutes;
