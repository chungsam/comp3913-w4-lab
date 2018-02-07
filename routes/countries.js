var express = require("express");
var mongojs = require("mongojs");
var config = require("../config/index");
var db = mongojs(config.database_mlab, ["countries"]);

var router = express.Router();

// get all countries
router.get("/countries", function(req, res, next) {
  db.countries.find((err, data) => {
    if (err) res.send(err);
    res.json(data);
  });
});

// get country by id
router.get("/countries/:id", function(req, res, next) {
  db.countries.findOne({ _id: mongojs.ObjectId(req.params.id) }, function(
    err,
    data
  ) {
    if (err) {
      res.send(err);
    }
    res.json(data);
  });
});

// add a country
router.post("/countries", function(req, res, next) {
  var country = req.body;

  if (!country.country || !country.population) {
    res.status(400);
    res.json({
      error: "Invalid data, country could not be added to database."
    });
  } else {
    db.countries.save(country, function(err, data) {
      if (err) res.send(err);
      res.json(data);
    });
  }
});

// delete a country
router.delete("/countries/:id", function(req, res, next) {
  db.countries.remove({ _id: mongojs.ObjectId(req.params.id) }, function(err, data) {
    if (err) res.send(err);
    res.json(data);
  });
});

// update a country
router.put("/countries/:id", function(req, res, next) {
  var country = req.body;
  var changedCountry = {};

  if (country.country) {
    changedCountry.country = country.country;
  }

  if (country.population) {
    changedCountry.population = country.population;
  }

  if (Object.keys(changedCountry).length == 0) {
    res.status(400);
    res.json({ error: "Bad Data" });
  } else {
    db.countries.update(
      { _id: mongojs.ObjectId(req.params.id) },
      changedCountry,
      {},
      function(err, data) {
        if (err) res.send(err);
        res.json(data);
      }
    );
  }
});

module.exports = router;
