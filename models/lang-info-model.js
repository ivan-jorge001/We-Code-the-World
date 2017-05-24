const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuA = require('./QuA-model.js');
const infolangSchema = new Schema({

  name:{type:String},
  Docs:{type:String},
  tutorials:[{
    whoPuttutorial:{type:String}}],
  QuA:[QuA.schema],
  author:{type:String},
},{
  timestamps: true
});

const InfoLang = mongoose.model('infolanguages', infolangSchema);

module.exports = InfoLang;
