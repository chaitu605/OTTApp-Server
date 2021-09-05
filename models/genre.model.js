const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    genreId: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
    genre: { type: String, required: true },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Genre = mongoose.model("Genre", schema);

module.exports = Genre;
