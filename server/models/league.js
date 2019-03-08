const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
  id: String,
  name: String,
  createdBy: [{ type: Schema.Types.UserId, ref: "User" }],
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active"
  },
  timestamps: { createdAt: "created_at", expiredAt: "expired_at" }
});

const League = mongoose.model("League", leagueSchema);

module.exports = League;
