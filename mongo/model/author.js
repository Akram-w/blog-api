const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: String,
  email: String,
  joined: Date,
});
module.exports = mongoose.model('Author',schema);
