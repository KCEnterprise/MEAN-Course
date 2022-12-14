const mongoose = require('mongoose');

const postTemplate = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  creator: {type: mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Post', postTemplate);
