const Document = require("../models/document");
class DocumentController {
    getAllDocument = async (req, res) => {
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
}

module.exports = new DocumentController();