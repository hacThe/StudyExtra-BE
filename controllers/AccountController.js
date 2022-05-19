const User = require("../models/users");
const Course = require("../models/courses");
const req = require("express/lib/request");
const res = require("express/lib/response");
const ObjectId = require("mongodb").ObjectID;
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

    uploadAvatar = async (req, res) => {
        const username = res.locals.data.username;
        //  const username = "tanthanh1";
        const avatarUrl = req.body.avatarUrl;
        console.log("urlllllllllllllllllllllllllllllllll", avatarUrl)

        User.updateOne({ username: username }, { $set: { "avatar": avatarUrl } }).exec()
            .then(() => {
                User.findOne({ username: username }).exec()
                    .then((data) => {
                        console.log("user update: " + data)
                        res.status(201).send(
                            JSON.stringify({
                                user: data,
                            })
                        )
                    })
                    .catch((error) => {
                        res.status(404).send(error);
                    })
            })
            .catch((error) => {
                res.status(404).send(error);
            })
    }

    userBuyCourse = async (req, res) => {
        try {
            console.log(req.body)
            const courseID = req.body._id
            const username = req.body.username

            const user = await User.findOne({ username }).exec()
            const course = await Course.findOne({ courseID }).exec()
            // Check đã mua khóa học hay chưa
            user.courseID.forEach(value => {
                if (String(value) === String(course._id)) {
                    res.status(200).send(JSON.stringify({
                        status: 0,
                        message: 'Bạn đã mua khóa học'
                    }));
                }
            })

            // Check user và courses tồn tại để thêm khóa học vào database
            if (user && course) {
                user.courseID.push(course._id)
                user.save()
                    .then(result => {
                        if (result) {
                            res.status(200).send(JSON.stringify({
                                status: 1,
                                message: 'Mua khóa học thành công',
                                data: result
                            }));
                        }
                        console.log(result)
                    })
                    .catch(err => {
                        res.status(401).send(JSON.stringify({
                            status: 0,
                            message: 'Lỗi hệ thống'
                        }));
                    })
            }

            // await User.findOne({ username })
            //     .populate("courses")
            //     .exec()
            //     .then(result => {
            //         console.log(result)
            //     })

        } catch (err) {
            res.status(401).send(JSON.stringify({
                status: 0,
                message: 'Lỗi hệ thống'
            }));
        }
    }
}

module.exports = new AccountController();