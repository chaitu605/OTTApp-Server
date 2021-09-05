module.exports = (app) => {
  const Video = require("../controllers/video.controller");
  var router = require("express").Router();

  //add
  router.post("/upload", Video.add);

  //findall
  router.post("/all", Video.findAll);

  //find
  router.post("/getvideo", Video.findOne);

  //findgenre
  router.post("/:genre", Video.find);

  //findone

  router.get("/get/:id", Video.findById);

  //update
  router.put("/update/:id", Video.update);

  //delete
  router.delete("/:id", Video.delete);

  app.use("/api/videos", router);
};
