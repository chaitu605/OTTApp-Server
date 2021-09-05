const mongoose = require("mongoose");
const db = require("../models");
const Like = db.like;
const Dislike = db.dislike;

exports.getAlllikes = (req, res) => {
  Like.find({ videoId: req.body.videoId }).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    res.status(200).send({ success: true, likes });
  });
};

exports.getAlldislikes = (req, res) => {
  Dislike.find({ videoId: req.body.videoId }).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    res.status(200).send({ success: true, dislikes });
  });
};

exports.upLike = (req, res) => {
  const like = new Like({ videoId: req.body.videoId, userId: req.body.userId });
  //save the like info data in MongoDB database
  like.save((err, likeResult) => {
    if (err) return res.send({ sucess: false, err });
    //In case disLike Button is already clicked, need to decrease the dislike by 1
    Dislike.findOneAndDelete({
      videoId: req.body.videoId,
      userId: req.body.userId,
    }).exec((err, disLikeResult) => {
      if (err) return res.status(400).send({ success: false, err });
      res.status(200).send({ success: true });
    });
  });
};

exports.unLike = (req, res) => {
  Like.findOneAndDelete({
    videoId: req.body.videoId,
    userId: req.body.userId,
  }).exec((err, result) => {
    if (err) return res.status(400).send({ success: false, err });
    res.status(200).send({ success: true });
  });
};

exports.unDislike = (req, res) => {
  Dislike.findOneAndDelete({
    videoId: req.body.videoId,
    userId: req.body.userId,
  }).exec((err, result) => {
    if (err) return res.status(400).send({ success: false, err });
    res.status(200).send({ success: true });
  });
};

exports.upDislike = (req, res) => {
  const disLike = new Dislike({
    videoId: req.body.videoId,
    userId: req.body.userId,
  });
  //save the like info data in MongoDB database
  disLike.save((err, dislikeResult) => {
    if (err) return res.json({ success: false, err });
    //In case Like Button is already clicked, need to decrease the like by 1
    Like.findOneAndDelete({
      videoId: req.body.videoId,
      userId: req.body.userId,
    }).exec((err, likeResult) => {
      if (err) return res.status(400).send({ success: false, err });
      res.status(200).send({ success: true });
    });
  });
};
