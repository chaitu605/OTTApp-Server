const mongoose = require("mongoose");
const db = require("../models");
const Comments = db.comment;

exports.saveComment = (req, res) => {
  const comment = new Comments(req.body);
  comment.save((err, comment) => {
    if (err) return res.send({ success: false, err });

    Comments.find({ _id: comment.id })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.send({ success: false, err });
        return res.status(200).send({ success: true, result });
      });
  });
};

exports.getComment = (req, res) => {
  Comments.find({ postId: req.body.videoId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).send({ success: true, comments });
    });
};
