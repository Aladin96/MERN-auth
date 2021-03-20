const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    text : {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
     timestamps: true
    });

const Post = mongoose.model("post", postSchema);

exports.Post = Post;