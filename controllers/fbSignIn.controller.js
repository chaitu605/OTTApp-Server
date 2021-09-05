const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Roles = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { default: fetch } = require("node-fetch");

exports.facebookSignIn = (req, response) => {
  const { userID, accessToken } = req.body;

  let urlGraphFacebook = `https://graph.facebook.com/v11.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  fetch(urlGraphFacebook, { method: "GET" })
    .then((res) => res.json())
    .then((res) => {
      const { email, name } = res;
      User.findOne({ email })
        .populate("roles", "-__v")
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          } else {
            if (user) {
              var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400, //24hours
              });

              response.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles[0].name,
                accessToken: token,
              });
            } else {
              let password = email + config.secret;
              let newUser = new User({
                username: name,
                email,
                password,
              });
              newUser.save((err, user) => {
                if (err) {
                  response.status(500).send({ message: err });
                  return;
                } else {
                  var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400, //24hours
                  });

                  Roles.findOne({ name: "user" }, (err, role) => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }

                    user.roles = [role._id];
                    user.save((err) => {
                      if (err) {
                        res.status(500).send({ message: err });
                        return;
                      }
                      response.status(200).send({
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        roles: user.roles[0].name,
                        accessToken: token,
                      });
                    });
                  });
                }
              });
            }
          }
        });
    });
};
