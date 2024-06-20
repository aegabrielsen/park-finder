const Park = require("../models/park");

module.exports.index = async (req, res, next) => {
  const parks = await Park.find({});
  res.render("parks/index", { parks });
};

module.exports.renderNewForm = (req, res) => {
  res.render("parks/new");
};

module.exports.createPark = async (req, res, next) => {
  const park = new Park(req.body.park);
  park.author = req.user._id;
  await park.save();
  req.flash("success", "Sucessfully made a new park!");
  res.redirect(`parks/${park._id}`);
};

module.exports.showPark = async (req, res) => {
  const park = await Park.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!park) {
    req.flash("error", "Cannot find that park");
    res.redirect("/parks");
  }
  res.render("parks/show", { park });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const park = await Park.findById(id);
  if (!park) {
    req.flash("error", "Cannot find that park");
    res.redirect("/parks");
  }

  res.render("parks/edit", { park });
};

module.exports.updatePark = async (req, res) => {
  const { id } = req.params;
  const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
  req.flash("success", "Sucessfully updated a park!");
  res.redirect(`/parks/${park._id}`);
};

module.exports.destroyPark = async (req, res) => {
  const { id } = req.params;
  await Park.findByIdAndDelete(id);
  req.flash("success", "Deleted a park :(");
  res.redirect("/parks");
};
