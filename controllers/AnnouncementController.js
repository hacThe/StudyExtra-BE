const Announcement = require("../models/announcement");
class NotificationGenarelController {
    getAllAnnouncement = async (req, res) => {
        Announcement.find().exec()
            .then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        status: 200,
                        data: data
                    })
                )
            })
            .catch((error) => {
                res.status(404).send(error);
            })
    }


    getOneAnnoucement = async (req, res) => {
        const { slug } = req.params
        Announcement.findOne({ slug }).exec()
            .then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        status: 200,
                        data: data
                    })
                )
            })
            .catch((error) => {
                res.status(404).send(error);
            })
    }
}

module.exports = new NotificationGenarelController();