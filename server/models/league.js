const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leagueSchema = new Schema(
  {
    id: String,
    name: String,
    administrator: { type: Schema.Types.ObjectId, ref: "User" },
    photo: { type: String, default: "/images/default_league.png" },
    duration: Number,
    status: {
      type: String,
      enum: ["waiting", "active", "completed"],
      default: "waiting"
    },
    startDate: String,
    endDate: String
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const League = mongoose.model("League", leagueSchema);

module.exports = League;
