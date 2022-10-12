const Post = require('../models/post');

exports.createposts = (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title:req.body.title,
    content:req.body.content,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
    message: 'Post added successfully',
    postId :createdPost._id
  });
  }).catch(error =>{
    res.status(500).json({
      message: 'Creating a post failed!'
    })
  })
}

exports.updatePost = (req, res, next)=>{
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content:req.body.content,
    creator : req.userData.userId
  })

  Post.updateOne({_id:req.params.id, creator:req.userData.userId}, post)
  .then(result =>{
    if (result.modifiedCount>0){
    res.status(200).json({message:'Update successful!'});
    }else{
      res.status(402).json({message:"Invalid Authorization"});
    }
  })
  .catch(error =>{
    res.status(500).json({
      message:"Unable to update post!"
    });
  });
};

exports.getPosts = (req, res, next) => {
  Post.find().then(documents =>{
    console.log(documents);
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  })
  .catch(error =>{
    res.status(500).json({
      message:"Fetching posts failed"
    });
  })
}

exports.getSinglePost = (req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if (post){
      res.status(200).json(post);
    }else{
      res.status(404).json({message: 'Post not found!'});
    }
  })
  .catch(error =>{
    res.status(500).json({
      message:"Unable to update post!"
    });})
};

exports.deletePost = (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id, creator:req.userData.userId})
  .then(result => {
    if (result.deletedCount>0){
      console.log(result);
      res.status(200).json({message:'Deletion successful!'});
      }else{
        res.status(401).json({message:"Invalid Authorization"});
      }
  })
  .catch(error =>{
    res.status(500).json({
      message:"Fetching posts failed"
    });
    })
};

