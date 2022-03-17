const Notification = require("../models/notification");
const User =  require("../models/users");
class NotificationController {
  getUserNotification = async (req, res) => {
    //const username = req.body.username;
    const username = res.locals.data.username;
    console.log("local data:", username);
    
    Notification.find({ username: username }).sort({ createdAt: -1 }).limit(10).exec()
      .then((data) => {
        res.status(200).send(
          JSON.stringify({
            data: data
          })
        )
      })
      .catch((error) => {
        res.status(404).send(error);
      })
  }
  createNotification = async (req, res) => {
    
    const newNotification = new Notification({
      username: req.body.username,
      content: req.body.content,
      type: req.body.type,
      creator: req.body.creator,
      imgUrl: req.body.imgUrl,
      fileUrl: req.body.fileUrl
    });
    console.log("not: ", newNotification);

    newNotification.save().then((data) => {
      res.status(201).send(
        JSON.stringify({
          message: "Create notification successfully",
        })
      );
    });
  }
}

module.exports = new NotificationController();