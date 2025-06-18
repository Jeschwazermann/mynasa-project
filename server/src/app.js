const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const {
  match,
  pathToRegexp,
  compile,
  parse,
  stringify,
} = require("path-to-regexp");
const api = require("./routes/api");
//1. requests come into express
const app = express();
//cors middleware to allow all cross origin requests from any site
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined"));

//2. gets checked for json contents type
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.get("/*any", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
