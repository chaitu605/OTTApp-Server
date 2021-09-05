module.exports = (app) => {
  const Comment = require("../controllers/comment.controller");
  var router = require("express").Router();

  router.post("/savecomment", Comment.saveComment);

  router.post("/getcomment", Comment.getComment);

  app.use("/api/comment", router);
};
