const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Com = require('./comment-model.js');

const postSchema = new Schema({
content:{type:String},
photos:[],
people:{type:String},
whocanseeit: {
    type: String,
    enum: ['Friends', 'Work','Everyone'],
    default: 'Everyone'
},
userwhocreateit:{type:String},
comment:[Com.schema]


}, {
        // Adds createdAt & updatedAt to documents
        timestamps: true
    });
const Post = mongoose.model('Post',postSchema);
module.exports = Post;
