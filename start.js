// create endpoints
const express = require("express");
let app = express();
app.get("/", (req, res) => res.send("Hi there dev :)"));
app.get("/services/ping", (req, res) => res.send("Services ping is ok :)"));
app.listen("8000", () => console.log(`App started.`));
