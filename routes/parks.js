const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Park = require("../models/park");
const { parkSchema } = require("../schemas");

const validatePark = (req, res, next) => {
  const { error } = parkSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const parks = await Park.find({});
    res.render("parks/index", { parks });
  })
);

router.get("/new", (req, res) => {
  res.render("parks/new");
});

router.post(
  "/",
  validatePark,
  catchAsync(async (req, res, next) => {
    const park = new Park(req.body.park);
    await park.save();
    res.redirect(`parks/${park._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id).populate("reviews");
    res.render("parks/show", { park });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    res.render("parks/edit", { park });
  })
);

router.put(
  "/:id",
  validatePark,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    res.redirect(`/parks/${park._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    res.redirect("/parks");
  })
);

module.exports = router;
