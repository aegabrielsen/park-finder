const express = require("express");
const router = express.Router();
const parks = require("../controllers/parks");
const catchAsync = require("../utils/catchAsync");
const Park = require("../models/park");
const { isLoggedIn, isAuthor, validatePark } = require("../middleware");

router.get("/", catchAsync(parks.index));

router.get("/new", isLoggedIn, parks.renderNewForm);

router.post("/", isLoggedIn, validatePark, catchAsync(parks.createPark));

router.get("/:id", catchAsync(parks.showPark));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(parks.renderEditForm));

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validatePark,
  catchAsync(parks.updatePark)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(parks.destroyPark));

module.exports = router;
