const User = require("../models/users");
const Course = require("../models/courses");

class AccountController {
    getUserCourses = async (req, res) => {

        // const coursesID = req.body.coursesID;

        const username = res.locals.data.username;
        User.findOne({ username: username }).exec()
            .then((data) => {
                var ObjectId = require('mongodb').ObjectId;
                let coursesObjectID = [];
                data.courseID.forEach(function (element) {
                    let o_id = new ObjectId(element);
                    coursesObjectID.push(o_id);
                });

                Course.find({ _id: { $in: coursesObjectID } }).exec()
                    .then((data) => {
                        console.log("data: ", data);
                        res.status(200).send(
                            JSON.stringify({
                                data: data
                            })
                        )
                    })
                    .catch((error) => {
                        res.status(404).send(error);
                    })
            })
            .catch((error) => {
                console.log(error);
            })
    }
}

module.exports = new AccountController();