const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

//array to store planets that meet our conditions
//const habitablePlanets = [];

//This function checks if a planet is confirmed to exist, satisfying the planet property is confirmed
function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
//readdstream is reading the raw data  from kepler data csv as bits and bytes
//the pipe function connects a readable stream source to a readbale stream destination. the parse() function is the destintion

function loadPlanetsData() {
  //createreadstream reads the file from the csv bit by bit
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#", //ignore the lines that start with #
          columns: true, //converts each row into an object
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
          // habitablePlanets.push(data); // if data confirmed, it adds it to the habitablePlanets array
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      }); //Once the file has been fully read, it prints the confirmed planets and logs "done".
  });
}

//parse();
//the on function returns the event emitter that it was called on

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    } /*we aree telling the find operation to speccifically exclude propertirs whcihc match these names */
  ); //looking for all planets hence the empty object
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets, //habitablePlanets values is set to the property named  planet
};
