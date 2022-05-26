const Exam = require("../models/exam");
const Course = require("../models/courses");
const { RemoveAccents } = require("../helper/RemoveAccent");
const User = require("../models/users");

class userController {
  getAllUser = async (req, res) => {
    User.find()
      .populate("transactions")
      .exec()
      .then((data) => {
        res.status(200).send(
          JSON.stringify({
            data: data,
          })
        );
      })
      .catch((error) => {
        res.status(404).send(error.toString());
      });
  };

  getUser = async (req, res) => {
    const id = req.params.id || res.locals.data.userId;
    User.findById(id).populate('transactions courseID').exec()
      .then((data) => {
        res.status(200).send(
          JSON.stringify({
            data: data,
          })
        );
      })
      .catch((error) => {
        res.status(404).send(error.toString());
      });
  };

  getCurrentUser = async (req, res) => {
    const id =  res.locals.data.userId
    
    User.findById(id).populate('transactions courseID').exec()
      .then((data) => {
        res.status(200).send(
          JSON.stringify({
            data: data,
          })
        );
      })
      .catch((error) => {
        res.status(404).send(error.toString());
      });
  };

  toogleLockState = async (req, res) => {
    User.findById(req.params.id).then((user) => {
      user.isLock = !!!user.isLock;
      user
        .save()
        .then((data) => {
          res.status(200).send(JSON.stringify({ data }));
        })
        .catch((err) => {
          console.log(err);
          res.status(404).send(err);
        });
    });
  };

  _delete = async (req, res) => {
    User.findOneAndDelete(req.params.id)
      .then((data) => {
        res.status(200).send(JSON.stringify({ data }));
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send(err);
      });
  };
}

module.exports = new userController();
