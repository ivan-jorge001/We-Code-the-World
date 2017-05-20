const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const langSchema = new Schema({
tools:[{
  name:{type:String},
  Docs:{type:String},
  tutorials:[{
    whoPuttutorial:{type:String}}],
  QuA:[{
    authorOfQuestion:{type:String},
    question:{type:String},
    answer:{type:String},
    upvotes:{type:Number},
    problemPic:{type:String}
  }],
  author:
}],

});

module.exports = langSchema;
