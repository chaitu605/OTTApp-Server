const db = require("../models");
const config = require("../config/auth.config");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(`${process.env.OAuth_Client}`);
const User = db.user;
const Roles = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.googleSignIn = (req, response) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "351452176420-75k0r7s42ln8edho1tgenjg60l0n7hkd.apps.googleusercontent.com",
    })
    .then((res) => {
      const { email_verified, name, email } = res.payload;
      if (email_verified) {
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
                const newUser = new User({
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
                        response.status(500).send({ message: err });
                        return;
                      }

                      user.roles = [role._id];
                      user.save((err) => {
                        if (err) {
                          response.status(500).send({ message: err });
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
      }
    });
};
