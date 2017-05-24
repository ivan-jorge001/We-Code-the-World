const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectsSchema = new Schema({
projectFile:{type:String},
description:{type:String},
tasks:{type:String},
github:{type:String},
team:{type:String}
},{
  timestamps: true
});

const Project = mongoose.model('projects', projectsSchema);

module.exports = Project;
