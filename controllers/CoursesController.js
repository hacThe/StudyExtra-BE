const Course = require("../models/courses");
const ObjectId = require('mongodb').ObjectID;
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
    
    

    getCourseInfomation= async (req, res)=>{
        const _id = req.body._id;
        console.log(_id)
        Course.findOne({_id: ObjectId(_id)}).exec()
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