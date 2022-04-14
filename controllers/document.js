const Document = require("../models/document");
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
            documentID: req.body.documentID,
            name: req.body.name,
            typeID: req.body.typeID,
            views: req.body.views
        })
        

        // newDocument.save()
        //     .then((data) => {
        //         res.status(200).send({
        //             JSON.stringify({
        //                 success: true,
        //                 data: data
        //             })
        //         });
        //     })
        //     .catch(error){
        //         res.status(404).send(error);
        //     }
        // )
        newDocument.save()
        .then((data) =>{
            res.status(200).send({
                success: true,
                data: data
            });
        })
        .catch((error)=>{
            console.log("error", error)
            res.status(404).send({success:false});
        })
    }   
}

module.exports = new DocumentController();