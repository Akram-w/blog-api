const express = require("express");
const CONFIG = require("./config/config");
const mongoose = require("mongoose");
const routes = require("./controllers/commonRoutes");

mongoose
  .connect(CONFIG.mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use("/api", routes);
    app.listen(CONFIG.port, () => {
      console.log(`server started listening to ${CONFIG.port}`);
    });
  });
