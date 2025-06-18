const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map(); // Initializes a new Map to store launches

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 27, 2030"), //data_local
  target: "Kepler-442 b", //not applicable
  customers: ["ZTM", "NASA"], //payload.customers for each payload
  upcoming: true, //upcoming
  success: true, //success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading launch data");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("LAUNCH DATA FAILED");
  }

  //launchDocs is the data coming from the body of our response
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);

    //populate launches collection...
    await saveLaunch(launch);
  }
}

//pagination can be done by passing in whats called the query parameter into our get request. Things like adding a ?param=value
//an example isa get request: http://localhost:8000/v1/launches?limit=50&page=3

//requesting data we need from the space data API
//loading spacex data in our api uising axios to make http request to the url
//pagination wass turned off in the body of the api request and params
async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

//launches.set(launch.flightNumber, launch); // Adds the launch to the Map with key = 100
async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}
//getting latest flightnumber and sorting by property
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber"); //the - is fpr sorting in descending order

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { __v: 0, _id: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip) //skips over the first xyz documents
    .limit(limit); //this returns the abc documents after skipping the xyz docs
}
async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  };

  console.log("Received new launch:", launch);

  await saveLaunch(newLaunch);

  return newLaunch;
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  console.log("Abort result:", aborted);

  return aborted.acknowledged === true && aborted.matchedCount === 1;
}

module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
