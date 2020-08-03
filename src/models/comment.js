const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;


const Comment = new mongoose.model("Comment" , {
    user : {
        type : ObjectId,
        required : true,
        ref: "User"
    },
    PostId : {
        type : ObjectId,
        required: true
    },
    content : {
        type : String,
        required: true,
        unique : true
    },
    createdAt : {
        type : Date,
        default : () => new Date()
    },
});

module.exports = Comment;