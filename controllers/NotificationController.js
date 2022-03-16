const Notification = require("../models/notification");

class NotificationController {
    getYourNotification = async (req, res) => {

        const userID = req.body.userID;
    
        Notification.find({userID: userID}).exec()
        .then((data) => {
            console.log( "data: ", data);
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
    createNotification = async (req, res) =>{
        const newNotification = new Notification({
            userID: req.body.userID,
            content: req.body.content,
            type: req.body.type,
            creator:req.body.creator,
            fileUrl: req.body.fileUrl
          });

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