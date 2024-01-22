const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPost = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    body: {
      type: String,
      required: true,
    },
    image:{
      type:String,
      reqired: true
    },
    author: {
        type: Object,
        required: true
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('BlogPost', BlogPost)