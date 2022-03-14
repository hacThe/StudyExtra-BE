const Course = require("../models/courses");
class CoursesController {
    getAllCourses = async (req, res) => {
        Course.find().exec()
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
}

module.exports = new CoursesController();