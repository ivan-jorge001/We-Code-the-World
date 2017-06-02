const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({}, {
        timestamps: true
    });
const Comment = mongoose.model('Comment',postSchema);
module.exports = Comment;
