const Questions = require("../models/question");
const Attention = require("../models/attention");
const TestExam = require('../models/testExam');
const Exam = require('../models/exam');
const res = require("express/lib/response");
const User = require("../models/users");
class ExamsController {

    saveExam = async (req, res) => {
        try {
            const { id, name, questionPoint, listQuestion, time, typeCategory, description } = req.body
            Exam.findByIdAndUpdate(id,
                {
                    name,
                    questionPoint,
                    listQuestion,
                    time,
                    typeCategory,
                    description
                },
                (err, docs) => {
                    if (err) {
                        res.status(401).send(JSON.stringify({
                            message: "Get failed"
                        }))
                    } else {
                        res.status(201).send(JSON.stringify({
                            message: 'Save success',
                            data: docs,
                        }))
                    }
                })
        } catch {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    deleteExam = async (req, res) => {
        try {
            const { id } = req.body
            Exam.findByIdAndDelete(id, (err, docs) => {
                if (err) {
                    res.status(401).send(JSON.stringify({
                        message: "Get failed"
                    }))
                } else {
                    res.status(201).send(JSON.stringify({
                        message: 'Delete success',
                        data: docs,
                    }))
                }
            })
        } catch {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    getExamEdit = async (req, res) => {
        try {
            const { id } = req.params
            Exam.findById(id, (err, docs) => {
                if (err) {
                    res.status(401).send(JSON.stringify({
                        message: "Get failed"
                    }))
                } else {
                    res.status(201).send(JSON.stringify({
                        message: 'Get success',
                        data: docs,
                    }))
                }
            })

        } catch (err) {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    getAllTestExam = async (req, res) => {
        try {
            await Exam.find().exec()
                .then(result => {
                    res.status(201).send(JSON.stringify({
                        message: 'Get success',
                        data: result
                    }))
                    console.log("all exam: ", result)
                })
                .catch(err => {
                    res.status(401).send(JSON.stringify({
                        message: "Get failed"
                    }))
                })
        } catch (err) {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    addNewExam = async (req, res) => {
        try {
            const { name, questionPoint, listQuestion, time, typeCategory, description } = req.body
            console.log(req.body)
            const newTestExam = new Exam({
                name,
                questionPoint,
                listQuestion,
                time,
                typeCategory,
                description
            })

            newTestExam.save()
                .then(result => {
                    if (result) {
                        res.status(201).send(JSON.stringify({
                            message: 'Send succes',
                            data: result
                        }))
                    } else {
                        res.status(401).send(JSON.stringify({
                            message: "Save failed"
                        }))
                    }
                })
                .catch(err => {
                    res.status(401).send(JSON.stringify({
                        message: "Save failed"
                    }))
                })
        } catch (err) {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    getExam = async (req, res) => {
        var ObjectId = require('mongodb').ObjectId;
        const examID = new ObjectId(req.params.id);
        console.log("ID: ", examID);///
        Exam.findOne({ _id: examID }).exec()
            .then((data) => {
                if (!data) return res.status(400).send("failure");
                console.log(data)

                return res.status(200).send(
                    JSON.stringify({
                        data: data,
                        message: "success"
                    })
                )
            })
            .catch((err) => {
                res.status(400).send(err);
            })
    }

    checkExamRequirement = async (req, res) => {
        const { id } = req.body;
        const username = res.locals.data.username;
        let testRound = 1;

        try {
            var ObjectId = require('mongodb').ObjectId;
            const examID = new ObjectId(id);
            const exam = await Exam.findOne({ _id: examID }).exec();
            console.log(exam);
            if (!exam) return res.status(400).send("Exam not found");
            await Exam.updateOne({ _id: examID }, { attempt: exam.attempt + 1 }).exec();

            const attention = await Attention.findOne({ username: username, examID: id }).sort({ '_id': -1 }).limit(1).exec();
            if (attention !== null && attention.testRound == exam.testCount) return res.status(400).send(JSON.stringify({ message: "Bạn không còn lượt làm bài" }));
            if (attention) {
                testRound = attention.testRound + 1;
            }

            const newAttention = new Attention({
                username: username,
                examID: id,
                score: 0,
                testRound: testRound,
                userAnswer: []
            })
            console.log("new attten: ", newAttention)
            newAttention.save().then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        mmessage: "you can taking"
                    })
                )
            });
        }
        catch (error) {
            res.status(400).send(error);
        }

    }

    postResultExam = async (req, res) => {
        const { examID, userAnswer } = req.body;
        const username = res.locals.data.username;
        let rightAnswer = [];
        let score = 0;
        var ObjectId = require('mongodb').ObjectId;
        const id = new ObjectId(examID)

        const exam = await Exam.findOne({ _id: id }).exec();
        console.log(exam);
        if (!exam) res.status(400).send("Exam not found");

        exam.listQuestion.forEach(element => {
            rightAnswer.push(element.rightAnswer);
        });
        for (var i = 0; i < rightAnswer.length; i++) {
            if (rightAnswer[i] + 1 === userAnswer[i]) score = score + 1;
        }

        Attention.findOne({ username: username, examID: examID }).sort({ '_id': -1 }).limit(1).exec()
            .then((data) => {
                if (!data) res.status(400).send('attention not found');
                const attID = new ObjectId(data._id);
                Attention.updateOne({ _id: attID }, { score: score, userAnswer: userAnswer }).exec()
                    .then(() => {
                        User.findOne({ username: username }).exec()
                            .then((user) => {
                                if (user) User.updateOne({ point: user.point + score }).exec();
                            })
                            .catch((error) => {
                                res.status(400).send(error);
                            })
                        res.status(200).send(
                            JSON.stringify({
                                message: "Save result success"
                            })
                        )
                    })
                    .catch((error) => {
                        res.status(400).send(error);
                    })
            })
            .catch((error) => {
                res.status(400).send(error);
            })
    }

    getResultExam = async (req, res) => {
        const examID = req.params.id;
        console.log("ttttttttttttttttt: ", examID);
       // const username = res.locals.data.username;
       const username = 'tanthanh3'
        console.log(examID);

        Attention.findOne({ examID: examID, username: username }).sort({ '_id': -1 }).limit(1).exec()
            .then((data) => {
                console.log(data);
                res.status(200).send(
                    JSON.stringify({
                        message: "get success",
                        data: data
                    })
                )
            })
            .catch((error)=>{
                res.status(400).send(error);
            })
    }
}

module.exports = new ExamsController();