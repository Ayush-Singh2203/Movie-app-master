const express = require("express");
const router = express.Router();

const { Favorite } = require("../models/Favorite");

const { auth } = require("../middleware/auth");

// api/favorite/(index.js route to this file) / favorteNumber
router.post("/favoriteNumber", (req, res) => {
  // Find Favorite Info inside Favorite Collection using movie Id thne execute query
  Favorite.find({ movieId: req.body.movieId }).exec((err, favorite) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, favoriteNumber: favorite.length });
  });
});

router.post("/favorited", (req, res) => {
  // Find Favorite Info inside Favorite Collection by movieID
  // also userFrom as we want to know if that user has added to fav or not
  Favorite.find({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, favorite) => {
    if (err) return res.status(400).send(err);

    // if added already then inside favorite there should be something
    let result = false;
    if (favorite.length !== 0) {
      return true;
    }

    res.status(200).json({ success: true, favorited: result });
  });
});

router.post("/addToFavorite", (req, res) => {
  // Save the info about the movie or user Id inside favorite config

  const favorite = new Favorite(req.body);

  favorite.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/removeFromFavorite", (req, res) => {
  Favorite.findOneAndDelete({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});

router.post("/getFavoritedMovie", (req, res) => {
  //Need to find all of the Users that I am subscribing to From Subscriber Collection
  Favorite.find({ userFrom: req.body.userFrom }).exec((err, favorites) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, favorites });
  });
});

module.exports = router;
