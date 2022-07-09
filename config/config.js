const dotenv = require("dotenv").config();

const CONFIG = {};

CONFIG.port = dotenv.port || 5000;
CONFIG.mongoUrl = "mongodb://localhost:27017/acmedb";

module.exports = CONFIG;
