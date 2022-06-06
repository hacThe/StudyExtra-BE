const Chapter = require("../models/chapter");
const Course = require("../models/courses");
var mongoose = require('mongoose');

class LessonController {
    getCourseInfoByCourseID = async(req, res) => {

        console.log("req.body", req.body);
        console.log("req.params.id", req.params.id);

        let currentCourseChapter;
        await Course.find({
            courseID : req.params.id
        }).populate("chapters")
        .exec()
        .then((data) => {
            currentCourseChapter = data;
        })
        .catch((error) => {
            return res.status(404).send({
                success: false
            });
        });

        res.status(200).send({
            run: true,
            currentCourseChapter: currentCourseChapter
        })
    }
}

module.exports = new LessonController();