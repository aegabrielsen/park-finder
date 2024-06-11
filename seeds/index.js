const mongoose = require("mongoose");
const cities = require("./cities");
const Park = require("../models/park");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/park-finder");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Park.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const park = new Park({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price: `${Math.floor(Math.random() * 10)}`,
    });
    await park.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
