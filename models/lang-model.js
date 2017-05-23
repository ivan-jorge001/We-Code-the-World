const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const infoLang = require('./lang-info-model.js');
const QuA = require('./QuA-model.js');

const langSchema = new Schema({
  name:{type:String},
tools:[infoLang.schema],
framework:[infoLang.schema],
libaries:[infoLang.schema],
addedByWho:{type:String},
question:[QuA.schema],
imgofLang:{type:String},
colorRep:{type:String}
},{
  timestamps: true
});

module.exports = langSchema;
