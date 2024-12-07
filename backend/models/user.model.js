const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["ngo", "contributor"],
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
