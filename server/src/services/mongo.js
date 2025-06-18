const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGO_URL;

async function mongoConnect() {
  await mongoose
    .connect(MONGODB_URL)
    .then(() => {
      console.log("mongoDB is connected");
    })
    .catch((error) => {
      console.log(error);
    });
}

// mongoose.connection.once("open", () => {
//   console.log("MongoDB is ready");
// });
// mongoose.connection.on("error", (err) => {
//   console.error(err);
// });

//disconnect function from mongo
async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
