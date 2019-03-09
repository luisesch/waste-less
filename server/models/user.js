const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    motto: String,
    photo: { type: String, default: "/images/default_profile.jpg" },
    googleID: String,
    leagues: [{ type: Schema.Types.ObjectId, ref: "Travel" }],
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending Confirmation", "Active"],
      default: "Pending Confirmation"
    },
    confirmationCode: String
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
