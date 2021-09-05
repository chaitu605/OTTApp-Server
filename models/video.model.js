const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    description: { type: String },
    genre: { type: String, ref: "Genre" },
    videoId: { type: String },
    duration: { type: String },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Video = mongoose.model("Video", schema);

module.exports = Video;
