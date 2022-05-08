const Document = require("../models/document");
var mongoose = require('mongoose');
class DocumentController {
    getAllDocument = async (req, res) => {
        console.log("nav to get document");
        Document.find().exec()
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

    addNewDocument = async(req, res) => {
        console.log("req.body", req.body);
        var newDocument = new Document({    
            _id: mongoose.Types.ObjectId(),
            documentID: mongoose.Types.ObjectId().toString(),
            name: req.body.name,
            typeID: req.body.typeID,
            views: req.body.views,
            link: req.body.link,
            author: req.body.author,
            isHidden: false,
        })
        newDocument.save()
        .then((data) =>{
            res.status(200).send({
                success: true,
                data: data,
            });
        })
        .catch((error)=>{
            console.log("error", error)
            res.status(404).send({success:false});
        })
    }   

    deleteDocuments = async(req, res) => {
        console.log(req.body);
        Document.deleteMany({_id : { $in: [...req.body.listID]}})
        .then((data) =>{
            res.status(200).send({
                success: true,
                data: data,
            });
        })
        .catch((error)=>{
            console.log("error", error)
            res.status(404).send({success:false});
        })
        // res.status(200).send({success:true});
    }
}

module.exports = new DocumentController();