const mongoose = require("mongoose");
const db = require("../models");
const cloudinary = require("../config/cloudinary.config");
const Videos = db.video;

//Find all Videos

exports.findAll = (req, res) => {
  Videos.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching Videos.",
      });
    });
};

//Find single Video

exports.findById = (req, res) => {
  const id = req.params.id;

  Videos.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find data with ${id}`,
        });
      } else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some Error Ocurred!",
      });
    });
};

//Update Video

exports.update = (req, res) => {
  const id = req.params.id;

  if (!req.body) {
    res.status(500).send({
      message: `Data to update cannot be Empty`,
    });
  }
  Videos.findByIdAndUpdate(id, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Data with ${id}`,
        });
      } else
        res.send({
          message: `Updated Sucessfully`,
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || `Some Error Occured!`,
      });
    });
};

//Add video

exports.add = (req, response) => {
  const { title, description, genre, thumbnail, videoId } = req.body;
  cloudinary.uploader.upload(
    thumbnail,
    {
      upload_preset: "OTTApp",
      folder: "thumbnails",
      resource_type: "image",
    },

    (err, result) => {
      if (err) {
        response.send({ success: false, message: err });
      }
      Videos.findOne({ videoId: { $eq: videoId } })
        .then((res) => {
          if (res === undefined || res === null) {
            const newVideo = new Videos({
              title: title,
              description: description,
              genre: genre,
              thumbnail: result.secure_url,
              videoId: videoId,
            });
            newVideo
              .save()
              .then((res) => {
                response.status(200).send({ success: true, video: res });
              })
              .catch((err) => {
                response.status(500).send({ success: false, message: err });
              });
          } else {
            response.send({
              success: false,
              message: "videoId already in use",
            });
          }
        })
        .catch((err) => {
          response.status(500).send({ success: false, message: err });
        });
    }
  );
};

//Delete Video

exports.delete = (req, res) => {
  const id = req.params.id;

  Videos.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Delete Data with ID ${id}`,
        });
      } else res.status(200).send({ message: "Deleted Sucessfully" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some Error Occured!",
      });
    });
};

//findgenre

exports.find = (req, res) => {
  const genre = req.params.genre;

  Videos.find({ genre: genre })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while fetching videos with this genre.",
      });
    });
};

//findone

exports.findOne = (req, res) => {
  Videos.findOne({ _id: req.body.videoId })
    .populate("uploader")
    .exec((err, video) => {
      if (err) return res.send({ success: false, err });
      return res.status(200).send({ success: true, video });
    });
};
