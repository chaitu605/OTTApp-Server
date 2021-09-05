const mongoose = require("mongoose");
const config = require("../config/db.config");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = config.url;
db.user = require("./user.model");
db.role = require("./roles.model");
db.video = require("./video.model");
db.like = require("./like.model");
db.dislike = require("./dislike.model");
db.comment = require("./comment.model");
db.genre = require("./genre.model");

db.ROLES = ["user", "admin"];

module.exports = db;
