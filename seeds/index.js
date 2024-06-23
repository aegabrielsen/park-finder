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
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const park = new Park({
      // YOUR USER ID
      author: "667347b9972d0841a8672b7d",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      // price: `${Math.floor(Math.random() * 10)}`,
      // image:
      //   "https://images.unsplash.com/photo-1502946522238-41a16aa200fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MjB8OTkxMjM2Mnx8ZW58MHx8fHx8",
      images: [
        {
          url: "https://res.cloudinary.com/dkwnbkb3y/image/upload/v1719016274/ParkFinder/wl91z4wduv8vpr2qtb9t.png",
          filename: "ParkFinder/wl91z4wduv8vpr2qtb9t",
        },
        {
          url: "https://res.cloudinary.com/dkwnbkb3y/image/upload/v1719016274/ParkFinder/eqphqzltakon7wwkteu6.png",
          filename: "ParkFinder/eqphqzltakon7wwkteu6",
        },
      ],
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatum corrupti consequuntur commodi, esse quisquam distinctio atque doloribus amet repellat delectus et! Atque exercitationem nihil iure voluptate sapiente quia eos quisquam?",
      price: Math.floor(Math.random() * 10),
    });
    await park.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
