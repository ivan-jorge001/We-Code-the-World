const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jobsSchema = new Schema({
companyName:{type:String},
jobDescription:{type:String},
pay:{type:String},
positionAvailable:{type:Number},
requirements:{type:String},
requireknowledge:{type:String},
terms:{ type:String, enum: ['Full Time', 'Part Time', 'Internship','One time Job']},
email: {type:String},
phone:{type:String}
},{
  timestamps: true
});

const Job = mongoose.model('jobs', jobsSchema);

module.exports = Job;
