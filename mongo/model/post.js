const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: String,
  content: String,
  created: Date,
  modified: Date,
  isPublished: Boolean,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
});
module.exports = mongoose.model("Post", schema);
