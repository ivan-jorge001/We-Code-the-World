const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post-model.js');
const infolangSchema = new Schema({

  name: {
    type: String
  },
  Docs: {
    type: String
  },
  tutorials: [{

    target: {
      type: String
    },
    content: {
      type: String
    },
    whoPuttutorial: {
      type: String
    }
  }],
  question: [Post.schema],
  author: {
    type: String
  },
  photo: {
    type: String
  },
  colorRep: {
    type: String
  }
}, {
  timestamps: true
});

const InfoLang = mongoose.model('infolanguages', infolangSchema);

module.exports = InfoLang;
