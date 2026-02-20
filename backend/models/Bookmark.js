const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    requireed: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Food", "Beach", "Shopping", "Cafe", "Travel", "Other"],
    default: "Other",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
