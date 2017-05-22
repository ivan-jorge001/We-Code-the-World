const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuASchema = new Schema({
  authorOfQuestion:[{
username:{type:String},
profpic:{type:String}
  }],
  question:{type:String},
  answer:{type:String},
  upvotes:{type:Number},
  problemPic:{type:String}
},{
  timeStamps:true
});


module.exports = QuASchema;
