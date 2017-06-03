const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const infoLang = require('./lang-info-model.js');
const QuA = require('./QuA-model.js');

const langSchema = new Schema({
  name:{type:String},
  profilepic:{type:String, default:'/profilepic/code.jpg'},
tools:[infoLang.schema],
framework:[infoLang.schema],
libaries:[infoLang.schema],
addedByWho:{type:String},
question:[QuA.schema],
colorRep:{type:String}
},{
  timestamps: true
});


const Lang = mongoose.model('languages', langSchema);

module.exports = Lang;
