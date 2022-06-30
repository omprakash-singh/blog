const mongoose = require('mongoose');

const blogPost = new mongoose.Schema({
     name: {
          type: String,
          required: true
     },
     email: {
          type: String,
          required: true
     },
     post: {
          type: String,
          required: true
     },
     date: {
          type: String,
          required: true
     }
});

const Post = mongoose.model('Post', blogPost);
module.exports = Post;