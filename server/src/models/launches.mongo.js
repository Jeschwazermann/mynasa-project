const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
  },
  customers: [String], //this meaans an array of strings for the customers property based on the model
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

//Connects launchesSchema with the "launches" collection
module.exports = mongoose.model("Launch", launchesSchema);
//launchesSchema is assigned to the launch collection
//the first argumrnt should always be the singular name of th ecollectionthat this model represents
//mongoose takes in what is passed in the arguemtn, lowercase it, make it plural and talk to the collectuon with that lowercase pluralised name
