/* Node Modules */
const express = require("express");

// adrian
// const passport = require('passport');

const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const path = require("path");
const env = require("dotenv").load();

// adrian
// const db = require('./db/database');
// const passportSetup = require('./helpers/passport-setup');

// adrian
// const Slack = require('./slack/slack');

// adrian
// const schedule = require("node-schedule");

const moment = require("moment");
// Routes
const authRoutes = require("./routes/auth-routes");

// adrian
// const apiRoutes = require("./routes/api-routes");

// adrian
// const slackRoutes = require('./routes/slack-routes');

// Controllers

// adrian
// const authController = require("./controllers/auth-controller");

var lastRan = moment()
  .subtract(1, "days")
  .format("D");
// Create the Express app
const app = express();

/* Node Middleware */

// This serves up the static files to be used.
// Should be the first middleware and ensure the folder does not contain index.html file
app.use(express.static("dist"));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Cookie Session used for user authenication.
// Set at 1 day
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE]
  })
);

// Initialize passport

// adrian
// app.use(passport.initialize());
// app.use(passport.session());

// Test DB

// adrian
// db.authenticate()
//   .then(() => console.log(`Database connected...`))
//   .catch(err => console.log(`Error: ${err}`));

// Models for the database

// adrian
// const models = require("./db/models/user-model");

// Sync database

// adrian
// models.sequelize
//   .sync()
//   .then(function() {
//     console.log("Synced with database");
//   })
//   .catch(function(err) {
//     console.log(err, "Something went wrong with the Database update! ");
//   });

// adrian
// schedule.scheduleJob({ hour: 10, minute: 1, second: 1 }, function () {
//   console.log("starting slack jobs");
//   Slack();
// });

// Set up routes

// adrian
// app.use("/auth", authRoutes);
// app.use("/api", apiRoutes);
// app.use("/slack", slackRoutes);

// adrian
// app.post("/mysql/run-query", function(req, res) {
//   console.log(req.body.query);
//   db.query(req.body.query).then(rows => {
//     res.set("Content-Type", "application/json");
//     res.send(rows);
//   });
// });

// This endpoint is needed for Shopify Cloud deployments
app.get("/services/ping", (req, res) => res.send("OK"));

// Here we serve up static files after checking if the user is authenticated
// adrian
// app.get("*", authController.isAuthenticated, (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/app.html"));
// });

// add unauthenticated route for testing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/app.html"));
});

// Listen for requests at port 8000
app.set("port", process.env.PORT || 8000);
const server = app.listen(app.get("port"), () => {
  console.log(`Server is now running on Port ${server.address().port}`);
});
