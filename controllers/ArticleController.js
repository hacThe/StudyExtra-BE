const Article = require("../models/article");
const User = require("../models/users");
var mongoose = require('mongoose');

class ArticleController {
    getAllArticles = async (req, res) => {
        var dataArticle;
        await Article.find().exec()
        .then((data) => {  
            dataArticle = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        // console.log("userData", userData)

        var summaryData = [];
        for(var i = 0; i < dataArticle.length; i++){
            var currentCmt = dataArticle[i].comments;
            // console.log("currentCmt", currentCmt.length);
            var refinedCmt = [];
            for(var k = 0; k < currentCmt.length; k++){
                var findCmtUser = false;
                // console.log("Chạy ở vòng k");
                for(var j = 0; j < userData.length; j++){
                    // console.log(userData[j]._id.toString(),currentCmt[k].userID);
                    if(userData[j]._id.toString() == currentCmt[k].userID){
                        // console.log("tìm thấy rồi")
                        currentCmt[k].username = userData[j].username,
                        currentCmt[k].name = userData[j].name,
                        currentCmt[k].userAvatar = userData[j].avatar,
                        findCmtUser = true;
                        break;
                    }
                }
                if(findCmtUser){
                    refinedCmt.push(currentCmt[k]);
                }
            }
            
            var currentData = {
                ...dataArticle[i]._doc,
                userID : dataArticle[i].userID,
                content: dataArticle[i].content,
                imgUrl: dataArticle[i].imgUrl,
                comments : refinedCmt,
            }
            

            var isFindUser = false;
            for(var j = 0; j < userData.length; j++){
                if(dataArticle[i].userID == userData[j]._id){
                    isFindUser = true;
                    currentData.username = userData[j].username,
                    currentData.avatar = userData[j].avatar;
                    currentData.name = userData[j].name;
                    break;
                }
            }
            if(isFindUser){
                summaryData.push(currentData);
            }
        }


        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )
    }   

    addArticles = async (req, res) => {
        console.log("req.body", req.body);
        var newArticle = new Article({    
            _id: mongoose.Types.ObjectId(),
            userID: req.body.userID,
            content: req.body.content,
            imgUrl: req.body.imgUrl,
            comments: req.body.comments,
            reactions: [],
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var username = "";
        var userAvatar = "";
        var name = "";

        for(var j = 0; j < userData.length; j++){
            if(newArticle.userID == userData[j]._id){
                username = userData[j].username,
                userAvatar = userData[j].avatar;
                name = userData[j].name;
                break;
            }
        }

        newArticle.save()
        .then((data) =>{
            res.status(200).send({
                success: true,
                data: {
                    ...data._doc,
                    username: username,
                    name: name,
                    avatar:userAvatar,
                },
            });
        })
        .catch((error)=>{
            console.log("error", error)
            res.status(404).send({success:false});
        })
        // res.status(200).send({run:true});
    }

    editArticle = async (req, res) => {
        console.log("req.body", req.body);


        await Article.findOneAndUpdate({_id: req.body._id}, 
            {
                content: req.body.content,
                imgUrl: req.body.imgUrl,
            }
        )
        .then((data) => {
            
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
        });

        var newI = await Article.findById(req.body._id);
        // if(!newI)
        //     res.status(404).send({find: false});
        
        console.log("newI", newI)
        var dataReturn = {...newI._doc};
        // var isFind = false;
        // var userData;

        await User.findById(newI.userID).exec()
            .then((data) => {  
                // userData = data;
                // isFind = true;
                console.log("data",data);
                dataReturn.username = data.username;
                dataReturn.name = data.name;
                dataReturn.avatar = data.avatar;
                res.status(200).send(
                    JSON.stringify({
                        data: dataReturn,
                    })
                );
            })
            .catch((error) => {
                res.status(404).send(error);
            })
        
            
        // console.log("userData", userData)
        // res.status(200).send({run:true});

    }

    deleteArticles = async (req, res) => {
        console.log("req.body", req.body);
        Article.findOneAndDelete({_id: req.body._id})
        .then((data) => {
            res.status(200).send(
                JSON.stringify({
                    data,
                })
            );
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
        });
        // res.status(200).send({run:true});
    }

    addBigComment = async (req, res) => {
        console.log("req.body", req.body);


        var currentArticle;
        await Article.findById(req.body.postID).exec()
        .then((data) => {  
            currentArticle = data;
        })
        .catch((error) => {
            res.status(404).send({run: false, error:error});
        })
        // console.log("currentArticle", currentArticle);


        var newCommentList = [
            ...currentArticle.comments,
            {
                commentID: mongoose.Types.ObjectId(),
                userID: req.body.userID,
                content: req.body.content,
                type: req.body.type,
                imgUrl: req.body.imgUrl,
                replyComment: [],
                isHidden: false,
                time: req.body.time,
                reactions: [],
            }
        ]
        // add new article comment
        await Article.findOneAndUpdate({_id: req.body.postID}, 
            {
                comments: newCommentList,
            }
        )
        .then((dataRes) => {
            
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
        });

        // console.log("Thực hiện xong việc add cmt rồi");

        // Lấy lại data của article rồi bắt đầu join các bảng để trả về cmt mới nhất cho người dùng
        var dataArticle;
        await Article.find().exec()
        .then((data) => {  
            dataArticle = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        // console.log("userData", userData)

        var summaryData = [];
        for(var i = 0; i < dataArticle.length; i++){
            var currentCmt = dataArticle[i].comments;
            // console.log("currentCmt", currentCmt.length);
            var refinedCmt = [];
            for(var k = 0; k < currentCmt.length; k++){
                var findCmtUser = false;
                // console.log("Chạy ở vòng k");
                for(var j = 0; j < userData.length; j++){
                    // console.log(userData[j]._id.toString(),currentCmt[k].userID);
                    if(userData[j]._id.toString() == currentCmt[k].userID){
                        // console.log("tìm thấy rồi")
                        currentCmt[k].username = userData[j].username,
                        currentCmt[k].name = userData[j].name,
                        currentCmt[k].userAvatar = userData[j].avatar,
                        findCmtUser = true;
                        break;
                    }
                }
                if(findCmtUser){
                    refinedCmt.push(currentCmt[k]);
                }
            }
            
            var currentData = {
                ...dataArticle[i]._doc,
                userID : dataArticle[i].userID,
                content: dataArticle[i].content,
                imgUrl: dataArticle[i].imgUrl,
                comments : refinedCmt,
            }
            

            var isFindUser = false;
            for(var j = 0; j < userData.length; j++){
                if(dataArticle[i].userID == userData[j]._id){
                    isFindUser = true;
                    currentData.username = userData[j].username,
                    currentData.avatar = userData[j].avatar;
                    currentData.name = userData[j].name;
                    break;
                }
            }
            if(isFindUser){
                summaryData.push(currentData);
            }
        }


        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )
    }

    deleteBigComment = async (req, res) => {
        console.log("req.body: ", req.body);
        // Tìm article liên quan
        var dataArticle;
        await Article.findById(req.body.postID).exec()
        .then((data)=>{
            dataArticle = data;
        })
        .catch((error)=>{
            res.status(404).send({
                success: false,
                findArticle: false,
                error: error,
            })
            return;
        })

        // Lấy cái commentID hiện tại và thực hiện xoá
        var allComments = dataArticle.comments;
        allComments = allComments.filter(function(item) {
            return item.commentID.toString() != req.body.commentID;
        })

        // Thay đổi và thử lấy giá trị sau khi thay đổi
        await Article.findOneAndUpdate({_id: req.body.postID}, 
            {
                comments: allComments,
            }
        )
        .then((dataRes) => {
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
            return;
        });

        // Lấy tất cả các giá trị article trả về
        var dataArticle;
        await Article.find().exec()
        .then((data) => {  
            dataArticle = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var summaryData = [];
        for(var i = 0; i < dataArticle.length; i++){
            var currentCmt = dataArticle[i].comments;
            var refinedCmt = [];
            for(var k = 0; k < currentCmt.length; k++){
                var findCmtUser = false;
                for(var j = 0; j < userData.length; j++){
                    // console.log(userData[j]._id.toString(),currentCmt[k].userID);
                    if(userData[j]._id.toString() == currentCmt[k].userID){
                        // console.log("tìm thấy rồi")
                        currentCmt[k].username = userData[j].username,
                        currentCmt[k].name = userData[j].name,
                        currentCmt[k].userAvatar = userData[j].avatar,
                        findCmtUser = true;
                        break;
                    }
                }
                if(findCmtUser){
                    refinedCmt.push(currentCmt[k]);
                }
            }
            
            var currentData = {
                ...dataArticle[i]._doc,
                userID : dataArticle[i].userID,
                content: dataArticle[i].content,
                imgUrl: dataArticle[i].imgUrl,
                comments : refinedCmt,
            }
            

            var isFindUser = false;
            for(var j = 0; j < userData.length; j++){
                if(dataArticle[i].userID == userData[j]._id){
                    isFindUser = true;
                    currentData.username = userData[j].username,
                    currentData.avatar = userData[j].avatar;
                    currentData.name = userData[j].name;
                    break;
                }
            }
            if(isFindUser){
                summaryData.push(currentData);
            }
        }


        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )
    }
    
    hideBigComment = async(req, res) => {
        console.log("req.body", req.body);
        // Tìm article liên quan
        var dataArticle;
        await Article.findById(req.body.postID).exec()
        .then((data)=>{
            dataArticle = data;
        })
        .catch((error)=>{
            res.status(404).send({
                success: false,
                findArticle: false,
                error: error,
            })
            return;
        })

        console.log("dataArticle",dataArticle)
        // Lấy cái commentID hiện tại
        var allComments = dataArticle.comments;
        for(var i = 0; i < allComments.length; i++){
            if(allComments[i].commentID.toString() == req.body.commentID){
                allComments[i].isHidden = true;
            }
        }

        // Thay đổi và thử lấy giá trị sau khi thay đổi
        await Article.findOneAndUpdate({_id: req.body.postID}, 
            {
                comments: allComments,
            }
        )
        .then((dataRes) => {
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
            return;
        });

         // Lấy tất cả các giá trị article trả về
        var dataArticle;
        await Article.find().exec()
        .then((data) => {  
            dataArticle = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var summaryData = [];
        for(var i = 0; i < dataArticle.length; i++){
            var currentCmt = dataArticle[i].comments;
            var refinedCmt = [];
            for(var k = 0; k < currentCmt.length; k++){
                var findCmtUser = false;
                for(var j = 0; j < userData.length; j++){
                    // console.log(userData[j]._id.toString(),currentCmt[k].userID);
                    if(userData[j]._id.toString() == currentCmt[k].userID){
                        // console.log("tìm thấy rồi")
                        currentCmt[k].username = userData[j].username,
                        currentCmt[k].name = userData[j].name,
                        currentCmt[k].userAvatar = userData[j].avatar,
                        findCmtUser = true;
                        break;
                    }
                }
                if(findCmtUser){
                    refinedCmt.push(currentCmt[k]);
                }
            }
            
            var currentData = {
                ...dataArticle[i]._doc,
                userID : dataArticle[i].userID,
                content: dataArticle[i].content,
                imgUrl: dataArticle[i].imgUrl,
                comments : refinedCmt,
            }
            

            var isFindUser = false;
            for(var j = 0; j < userData.length; j++){
                if(dataArticle[i].userID == userData[j]._id){
                    isFindUser = true;
                    currentData.username = userData[j].username,
                    currentData.avatar = userData[j].avatar;
                    currentData.name = userData[j].name;
                    break;
                }
            }
            if(isFindUser){
                summaryData.push(currentData);
            }
        }


        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )

        
    }

    showBigComment = async(req, res) => {
        console.log("req.body", req.body);
        // Tìm article liên quan
        var dataArticle;
        await Article.findById(req.body.postID).exec()
        .then((data)=>{
            dataArticle = data;
        })
        .catch((error)=>{
            res.status(404).send({
                success: false,
                findArticle: false,
                error: error,
            })
            return;
        })

        console.log("dataArticle",dataArticle)
        // Lấy cái commentID hiện tại
        var allComments = dataArticle.comments;
        for(var i = 0; i < allComments.length; i++){
            if(allComments[i].commentID.toString() == req.body.commentID){
                allComments[i].isHidden = false;
            }
        }

        // Thay đổi và thử lấy giá trị sau khi thay đổi
        await Article.findOneAndUpdate({_id: req.body.postID}, 
            {
                comments: allComments,
            }
        )
        .then((dataRes) => {
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
            return;
        });

         // Lấy tất cả các giá trị article trả về
        var dataArticle;
        await Article.find().exec()
        .then((data) => {  
            dataArticle = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var summaryData = [];
        for(var i = 0; i < dataArticle.length; i++){
            var currentCmt = dataArticle[i].comments;
            var refinedCmt = [];
            for(var k = 0; k < currentCmt.length; k++){
                var findCmtUser = false;
                for(var j = 0; j < userData.length; j++){
                    // console.log(userData[j]._id.toString(),currentCmt[k].userID);
                    if(userData[j]._id.toString() == currentCmt[k].userID){
                        // console.log("tìm thấy rồi")
                        currentCmt[k].username = userData[j].username,
                        currentCmt[k].name = userData[j].name,
                        currentCmt[k].userAvatar = userData[j].avatar,
                        findCmtUser = true;
                        break;
                    }
                }
                if(findCmtUser){
                    refinedCmt.push(currentCmt[k]);
                }
            }
            
            var currentData = {
                ...dataArticle[i]._doc,
                userID : dataArticle[i].userID,
                content: dataArticle[i].content,
                imgUrl: dataArticle[i].imgUrl,
                comments : refinedCmt,
            }
            

            var isFindUser = false;
            for(var j = 0; j < userData.length; j++){
                if(dataArticle[i].userID == userData[j]._id){
                    isFindUser = true;
                    currentData.username = userData[j].username,
                    currentData.avatar = userData[j].avatar;
                    currentData.name = userData[j].name;
                    break;
                }
            }
            if(isFindUser){
                summaryData.push(currentData);
            }
        }


        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )

        
    }

    interactArticle = async(req, res) => {
        console.log("req.body", req.body);
        // Lấy article hiện tại
        var currentArticle;
        await Article.findById(req.body.postID).exec()
        .then((data) => {  
            currentArticle = data;
        })
        .catch((error) => {
            res.status(404).send({run: false, error:error});
        })

        // Cập nhật thêm interaction vào thôi
        // Lấy các reaction hiện tại
        
        var currentReaction;
        try{
            currentReaction = currentArticle.reactions;
        }
        catch(e){
            currentReaction = [];
        }
    
        if(!currentReaction.includes(req.body.userID))
        currentReaction.push(req.body.userID);

        await Article.findOneAndUpdate({_id: req.body.postID}, 
            {
                reactions: currentReaction,
            }
        )
        .then((dataRes) => {
            
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
        });

        // Trả về dữ liệu tất cả các post
        var dataArticle;
        await Article.find().exec()
        .then((data) => {  
            dataArticle = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        // console.log("userData", userData)

        var summaryData = [];
        for(var i = 0; i < dataArticle.length; i++){
            var currentCmt = dataArticle[i].comments;
            // console.log("currentCmt", currentCmt.length);
            var refinedCmt = [];
            for(var k = 0; k < currentCmt.length; k++){
                var findCmtUser = false;
                // console.log("Chạy ở vòng k");
                for(var j = 0; j < userData.length; j++){
                    // console.log(userData[j]._id.toString(),currentCmt[k].userID);
                    if(userData[j]._id.toString() == currentCmt[k].userID){
                        // console.log("tìm thấy rồi")
                        currentCmt[k].username = userData[j].username,
                        currentCmt[k].name = userData[j].name,
                        currentCmt[k].userAvatar = userData[j].avatar,
                        findCmtUser = true;
                        break;
                    }
                }
                if(findCmtUser){
                    refinedCmt.push(currentCmt[k]);
                }
            }
            
            var currentData = {
                ...dataArticle[i]._doc,
                userID : dataArticle[i].userID,
                content: dataArticle[i].content,
                imgUrl: dataArticle[i].imgUrl,
                comments : refinedCmt,
            }
            

            var isFindUser = false;
            for(var j = 0; j < userData.length; j++){
                if(dataArticle[i].userID == userData[j]._id){
                    isFindUser = true;
                    currentData.username = userData[j].username,
                    currentData.avatar = userData[j].avatar;
                    currentData.name = userData[j].name;
                    break;
                }
            }
            if(isFindUser){
                summaryData.push(currentData);
            }
        }


        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )
    }

    unlikeArticle = async(req, res) => {
        console.log("req.body", req.body);
        // Lấy article hiện tại
        var currentArticle;
        await Article.findById(req.body.postID).exec()
        .then((data) => {  
            currentArticle = data;
        })
        .catch((error) => {
            res.status(404).send({run: false, error:error});
        })

        // Cập nhật thêm interaction vào thôi
        // Lấy các reaction hiện tại
        
        var currentReaction;
        try{
            currentReaction = currentArticle.reactions;
        }
        catch(e){
            currentReaction = [];
        }
    
        currentReaction = currentReaction.filter(function(item) {
            return item !== req.body.userID
        })

        await Article.findOneAndUpdate({_id: req.body.postID}, 
            {
                reactions: currentReaction,
            }
        )
        .then((dataRes) => {
            
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
        });

        // Trả về dữ liệu tất cả các post
        var dataArticle;
        await Article.find().exec()
        .then((data) => {  
            dataArticle = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        // console.log("userData", userData)

        var summaryData = [];
        for(var i = 0; i < dataArticle.length; i++){
            var currentCmt = dataArticle[i].comments;
            // console.log("currentCmt", currentCmt.length);
            var refinedCmt = [];
            for(var k = 0; k < currentCmt.length; k++){
                var findCmtUser = false;
                // console.log("Chạy ở vòng k");
                for(var j = 0; j < userData.length; j++){
                    // console.log(userData[j]._id.toString(),currentCmt[k].userID);
                    if(userData[j]._id.toString() == currentCmt[k].userID){
                        // console.log("tìm thấy rồi")
                        currentCmt[k].username = userData[j].username,
                        currentCmt[k].name = userData[j].name,
                        currentCmt[k].userAvatar = userData[j].avatar,
                        findCmtUser = true;
                        break;
                    }
                }
                if(findCmtUser){
                    refinedCmt.push(currentCmt[k]);
                }
            }
            
            var currentData = {
                ...dataArticle[i]._doc,
                userID : dataArticle[i].userID,
                content: dataArticle[i].content,
                imgUrl: dataArticle[i].imgUrl,
                comments : refinedCmt,
            }
            

            var isFindUser = false;
            for(var j = 0; j < userData.length; j++){
                if(dataArticle[i].userID == userData[j]._id){
                    isFindUser = true;
                    currentData.username = userData[j].username,
                    currentData.avatar = userData[j].avatar;
                    currentData.name = userData[j].name;
                    break;
                }
            }
            if(isFindUser){
                summaryData.push(currentData);
            }
        }


        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )
    }

    interactBigComment = async(req, res) => {
        console.log("req.body", req.body);

        // Tìm article hiện tại
        var currentArticle;
        await Article.findById(req.body.postID).exec()
        .then((data) => {  
            currentArticle = data;
        })
        .catch((error) => {
            res.status(404).send({run: false, error:error});
        })


        // find comment and add reaction the the comment 
        var currentCmtList = currentArticle.comments;
        console.log("1 currentCmtList", currentCmtList)


        for(var i = 0; i < currentCmtList.length; i++){
            if(currentCmtList[i].commentID.toString() == req.body.commentID.toString()){
                console.log('cmt',currentCmtList[i].reactions);
                if (!(currentCmtList[i].reactions.includes(req.body.userID))){
                    currentCmtList[i].reactions.push(req.body.userID);
                }
            }
        }

        console.log("currentCmtList", currentCmtList)

        // Chỉnh sửa cmt list
        await Article.findOneAndUpdate({_id: req.body.postID}, 
            {
                comments: currentCmtList,
            }
        )
        .then((dataRes) => {
            
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
        });

        // console.log("Thực hiện xong việc add cmt rồi");

        // Lấy lại data của article rồi bắt đầu join các bảng để trả về cmt mới nhất cho người dùng
        var dataArticle;
        await Article.find().exec()
        .then((data) => {  
            dataArticle = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        // console.log("userData", userData)

        var summaryData = [];
        for(var i = 0; i < dataArticle.length; i++){
            var currentCmt = dataArticle[i].comments;
            // console.log("currentCmt", currentCmt.length);
            var refinedCmt = [];
            for(var k = 0; k < currentCmt.length; k++){
                var findCmtUser = false;
                // console.log("Chạy ở vòng k");
                for(var j = 0; j < userData.length; j++){
                    // console.log(userData[j]._id.toString(),currentCmt[k].userID);
                    if(userData[j]._id.toString() == currentCmt[k].userID){
                        // console.log("tìm thấy rồi")
                        currentCmt[k].username = userData[j].username,
                        currentCmt[k].name = userData[j].name,
                        currentCmt[k].userAvatar = userData[j].avatar,
                        findCmtUser = true;
                        break;
                    }
                }
                if(findCmtUser){
                    refinedCmt.push(currentCmt[k]);
                }
            }
            
            var currentData = {
                ...dataArticle[i]._doc,
                userID : dataArticle[i].userID,
                content: dataArticle[i].content,
                imgUrl: dataArticle[i].imgUrl,
                comments : refinedCmt,
            }
            

            var isFindUser = false;
            for(var j = 0; j < userData.length; j++){
                if(dataArticle[i].userID == userData[j]._id){
                    isFindUser = true;
                    currentData.username = userData[j].username,
                    currentData.avatar = userData[j].avatar;
                    currentData.name = userData[j].name;
                    break;
                }
            }
            if(isFindUser){
                summaryData.push(currentData);
            }
        }


        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )
    }

}
module.exports = new ArticleController();