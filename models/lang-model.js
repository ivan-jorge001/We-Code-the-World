const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuA = require('./QuA-model.js');
const langSchema = new Schema({
tools:[{
  name:{type:String},
  Docs:{type:String},
  tutorials:[{
    whoPuttutorial:{type:String}}],
  QuA:[QuA.schema],
  author:{type:String},

}],

});

module.exports = langSchema;
