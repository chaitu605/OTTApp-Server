const mongoose = require("mongoose");
const db = require("../models");
const Genre = db.genre;

exports.findAll = (req, res) => {
  Genre.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching Genres.",
      });
    });
};

exports.add = (req, res) => {
  const genre = new Genre({
    genreId: mongoose.Types.ObjectId(),
    genre: req.body.genre,
  });
  genre
    .save(video)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some Error Occured!",
      });
    });
};
