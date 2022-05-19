const { RenameObjectKey } = require("../helper/RenameObjectKey");
const Chapter = require("../models/chapter");
const Course = require("../models/courses");
const ObjectId = require("mongodb").ObjectID;
class CoursesController {
  getAllCourses = async (req, res) => {
    Course.find()
      .populate("chapters")
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

  update = async (req, res) => {
    const id = req.params.id;
    const course = req.body;

    Course.findOneAndUpdate(
      {
        courseId: id,
      },
      {
        $set: {
          ...course,
        },
      },
      {
        returnOriginal: false,
      },
      function (err, data) {
        if (err) {
          res.status(404).send(err);
        } else {
          res.status(200).send(JSON.stringify(data));
        }
      }
    );
  };

  _delete = async (req, res) => {
    var id = req.params.id;
    Course.deleteOne({ _id: ObjectId(id) })
      .then((data) => {
        res.status(200).send(JSON.stringify(data));
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  };

  

  getOne = async (req, res) => {
    const id = req.params.id;
    Course.findOne({ courseId: id })
      .populate("chapters")
      .exec()
      .then((course) => {
        if (course) {
          course.chapters.map((item) => {
            Chapter.findById(item, function (err, crrChapter) {
              if (!err) {
                return crrChapter;
              }
              return {
                name: "",
                lessons: [],
              };
            });
          });
          console.log({ course });

          res.status(200).send(
            JSON.stringify({
              data: course,
            })
          );
        } else {
          res.status(404).send({ message: "Course not found" });
        }
      })
      .catch((error) => {
        res.status(404).send(error.toString());
      });
  };

  create = async (req, res) => {
    console.log("Tạo khóa học nè");
    console.log(req.body);
    const course = req.body;
    const id = req.body._id;
    Course.findOne({ courseId: id })
      .exec()
      .then((data) => {
        if (data) {
          res.status(404).send(
            JSON.stringify({
              message: "ID duplicated",
            })
          );
        } else {
          console.log("debug", { course, id });
          const _course = new Course({
            courseId: id,
            name: course.name,
            description: course.description,
            contents: course.contents,
            requirements: course.requirements,
            price: course.price,
            imgUrl: course.imgUrl,
            introVideoUrl: course.introVideoUrl,
            categories: course.categories || [],
            rating: [],
            studentIds: [],
            chapters: [],
            isHide: false,
          });

          console.log("debug 2", _course);
          _course
            .save()
            .then((data) => {
              res.status(200).send(JSON.stringify(data));
            })
            .catch((err) => {
              console.log(err);
              res.status(404).send(err);
            });
        }
      });
  };

  // getCourseInfomation = async (req, res) => {
  //   const _id = req.body._id;
  //   console.log(_id);
  //   Course.findOne({ _id: ObjectId(_id) })
  //     .exec()
  //     .then((data) => {
  //       res.status(200).send(
  //         JSON.stringify({
  //           data: data,
  //         })
  //       );
  //     })
  //     .catch((error) => {
  //       res.status(404).send(error);
  //     });
  // };

  addNewChapter = async (req, res) => {
    console.log(req.params.id);
    Course.findOne({
      _id: ObjectId(req.params.id),
    })
      .exec()
      .then((data) => {
        if (data) {
          Chapter.findOne({
            name: req.body.name,
          })
            .exec()
            .then((course) => {
              if (course) {
                res.status(400).send(
                  JSON.stringify({
                    message: "Name duplicated",
                  })
                );
              } else {
                const { name, index } = req.body;
                const _chapter = new Chapter({
                  name,
                  courseId: req.params.id,
                  lessons: [],
                });
                _chapter
                  .save()
                  .then((chapter) => {
                    Course.findById(req.params.id, function (err, course) {
                      if (!err) {
                        course.chapters.splice(index, 0, chapter._id);
                        course.save().then((editedCourse) => {
                          res.redirect(
                            `../../courses/${editedCourse.courseId}`
                          );
                        });
                      }
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(404).send(err);
                  });
              }
            });
        } else {
          res.status(404).send({ message: "Course not found" });
        }
      });
  };



  editChapter = async (req, res) =>{
    const id = req.params.id
    const chapter = req.body
    Chapter.findOneAndUpdate(
      {
        _id: ObjectId(id),
      },
      {
        $set: {
          ...chapter,
        },
      },
      {
        returnOriginal: false,
      },
      function (err, data) {
        if (err) {
          res.status(404).send(err);
        } else {
          console.log(data)
          res.redirect(
            `./courses/${data.courseId}`
          );
        }
      }
    );
  }
}

module.exports = new CoursesController();
