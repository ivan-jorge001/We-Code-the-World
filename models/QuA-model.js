const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuASchema = new Schema({
  authorOfQuestion:[String],
  question:{type:String},
  answer:{type:String},
  upvotes:{type:Number},
  problemPic:{type:String}
},{
  timestamps: true
});
const QuA = mongoose.model('questions', QuASchema);

module.exports = QuA;
