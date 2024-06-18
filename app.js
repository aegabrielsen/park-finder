const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { parkSchema, reviewSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const path = require("path");
const Park = require("./models/park");
const Review = require("./models/review");
const methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/park-finder");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validatePark = (req, res, next) => {
  const { error } = parkSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/parks",
  catchAsync(async (req, res, next) => {
    const parks = await Park.find({});
    res.render("parks/index", { parks });
  })
);

app.get("/parks/new", (req, res) => {
  res.render("parks/new");
});

app.post(
  "/parks",
  validatePark,
  catchAsync(async (req, res, next) => {
    // if (!req.body.park) throw new ExpressError("Invalid Park Data", 400);

    const park = new Park(req.body.park);
    await park.save();
    res.redirect(`parks/${park._id}`);
  })
);

app.get(
  "/parks/:id",
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id).populate("reviews");
    res.render("parks/show", { park });
  })
);

app.get(
  "/parks/:id/edit",
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    res.render("parks/edit", { park });
  })
);

app.put(
  "/parks/:id",
  validatePark,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    res.redirect(`/parks/${park._id}`);
  })
);

app.delete(
  "/parks/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    res.redirect("/parks");
  })
);

app.post(
  "/parks/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    park.reviews.push(review);
    await review.save();
    await park.save();
    res.redirect(`/parks/${park._id}`);
  })
);

app.delete(
  "/parks/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Park.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/parks/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
