const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
content:{type:String},
photos:[String],
people:{type:String},
whocanseeit: {
    type: String,
    enum: ['friends', 'work','everyone'],
    default: 'everyone'
}

});
const Post = mongoose.model('posts',postSchema);
module.exports = Post;
