module.exports = (app) => {
  const Like = require("../controllers/likeDislike.controller");
  var router = require("express").Router();

  router.post("/getlikes", Like.getAlllikes);

  router.post("/getdislikes", Like.getAlldislikes);

  router.post("/uplike", Like.upLike);

  router.post("/unlike", Like.unLike);

  router.post("/undislike", Like.unDislike);

  router.post("/updislike", Like.upDislike);

  app.use("/api/likes", router);
};
