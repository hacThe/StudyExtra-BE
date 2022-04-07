const User = require("../models/users");
const { JWTAuthToken } = require("../helper/JWT");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class AuthController {
  register = async (req, res) => {
    const username = req.body.username;
    const password = bcrypt.hashSync(req.body.password, saltRounds);
    console.log({ username, password });

    User.findOne({ username: username })
      .exec()
      .then((data) => {
        if (data) {
          res.status(409).send(
            JSON.stringify({
              message: "Username has been used",
            })
          );
        } else {
          const newUser = new User({
            username,
            password,
            role: "user"
          });

          newUser.save().then((data) => {
            res.status(201).send(
              JSON.stringify({
                message: "Sign up successfully",
                token: JWTAuthToken({
                  username,
                }),
                username,
                data,
              })
            );
          });
        }
      })
      .catch((err) => {
        res.send(
          JSON.stringify({
            status: -1,
            message: err.message,
          })
        );
      });
  };

  login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username })
      .exec()
      .then((data) => {
        //check password, if password is correct then get all data and respond for client
        if (bcrypt.compareSync(password, data.password)) {

          const {password, ...user} = data._doc

          res
            .status(200)
            .send(
              JSON.stringify({
                message: "Login successfully",
                user: user,
                token: JWTAuthToken({ username }),
              })
            );
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        res.status(401).send(
          JSON.stringify({
            message: "Login error, wrong username or password",
          })
        );
      });
  };

  refresh = async (req, res) => {
    console.log("Access to auth controller success");
    res.status(200).send(
      JSON.stringify({
        status: "HIIH",
        message: "This is message",
        token: "This is token",
        email: "This is email",
        data: res.locals.data,
      })
    );
  };
}

module.exports = new AuthController();
