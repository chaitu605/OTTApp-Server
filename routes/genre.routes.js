module.exports = (app) => {
  const Genre = require("../controllers/genre.controller");
  var router = require("express").Router();

  //add
  router.post("/", Genre.add);

  //findall
  router.get("/", Genre.findAll);

  app.use("/api/genres", router);
};
