const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Park = require("../models/park");
const { isLoggedIn, isAuthor, validatePark } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const parks = await Park.find({});
    res.render("parks/index", { parks });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("parks/new");
});

router.post(
  "/",
  isLoggedIn,
  validatePark,
  catchAsync(async (req, res, next) => {
    const park = new Park(req.body.park);
    park.author = req.user._id;
    await park.save();
    req.flash("success", "Sucessfully made a new park!");
    res.redirect(`parks/${park._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!park) {
      req.flash("error", "Cannot find that park");
      res.redirect("/parks");
    }
    res.render("parks/show", { park });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    if (!park) {
      req.flash("error", "Cannot find that park");
      res.redirect("/parks");
    }

    res.render("parks/edit", { park });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validatePark,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    req.flash("success", "Sucessfully updated a park!");
    res.redirect(`/parks/${park._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    req.flash("success", "Deleted a park :(");
    res.redirect("/parks");
  })
);

module.exports = router;
