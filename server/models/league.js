const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leagueSchema = new Schema(
  {
    id: String,
    name: String,
    administrator: { type: Schema.Types.ObjectId, ref: "User" },
    members: [
      {
        info: { type: Schema.Types.ObjectId, ref: "User" },
        confirmed: { type: Boolean, default: false }
      }
    ],
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const League = mongoose.model("League", leagueSchema);

module.exports = League;
