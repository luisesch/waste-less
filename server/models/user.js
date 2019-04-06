const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    motto: { type: String, default: "Ready to save the world?" },
    photo: { type: String, default: "/images/default_profile.png" },
    league: {
      info: { type: Schema.Types.ObjectId, ref: "League" },
      confirmed: { type: Boolean, default: false }
    },
    completedLeagues: [
      {
        info: { type: Schema.Types.ObjectId, ref: "League" },
        score: { type: Number }
      }
    ],
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

userSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    delete ret.email;
    delete ret.password;
    return ret;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
