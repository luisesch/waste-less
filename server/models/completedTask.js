const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const completedTaskSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    league: { type: Schema.Types.ObjectId, ref: "League" },
    task: String
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const completedTask = mongoose.model("CompletedTask", completedTaskSchema);

module.exports = completedTask;
