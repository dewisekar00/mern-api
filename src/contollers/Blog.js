const { validationResult } = require('express-validator');
const BlogPost = require('../models/blog');

module.exports = {
  createBlogPost: (req, res, next) => {
 
    // validasi taruh sini
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Invalid value');
      err.errorStatus = 400;
      err.data = errors.array();
      throw err;
    }


    if(!req.file){
      const err = new Error('Image should upload');
      err.errorStatus = 422;
      throw err;
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;


    const Posting = new BlogPost({
      title: title,
      body: body,
      image: image,
      author: { id: 1, name: 'anna' },
    });

    Posting.save()
      .then((result) => {
        res.status(201).json({
          message: 'Create Blog Post success',
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getAllBlogPost:(req,res,next) => {
BlogPost.find()
.then(result => {
  res.status(200).json({
    message: 'Data Blog Post Berhasil di panggil',
    data:result
  })
})
.catch(err => {
  next(err)
})
  },

  getBlogPostByID: (req,res,next) => {
    const postId = req.params.postId
  BlogPost.findById(postId)
  .then(result => {
if(!result) {
  // jika user masukin id yang salah/id yang ngga ada didatabase maka dia akan tetap masuk ke then dan ditangani dengan ini
  const error = new Error('Blog Post Tidak ditemukan')
  error.errorStatus = 404;
  throw error;
}
// kalo ada id nya masuk ke code ini
res.status(200).json({
  message: 'Data Blog Post Berhasil dipanggil',
  data: result

})
  }).catch(err =>{
    //jika error akan dihandle di depan
    next(err)
  })
  },
  
  updateBlogPost: (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Invalid value');
      err.errorStatus = 400;
      err.data = errors.array();
      throw err;
    }


    if(!req.file){
      const err = new Error('Image should upload');
      err.errorStatus = 422;
      throw err;
    }

  const postId = req.params.postId
  //then 1 untuk mencari data postingan 
  BlogPost.findById(postId)
  .then( post => {
    if(!post){
      const err = new Error('Blog Post Tidak ditemukan')
      err.errorStatus = 404 ;
      throw err;
    }
     // Update post properties
    post.title = req.body.title;
    post.image = req.file.path;
    post.body = req.body.body;
   // Save the updated post
    return post.save();
    
  })

  .then(result => {
  res.status(200).json({
    message: 'Update Postingan Success',
    data: result
  })
  })
  
  .catch( err => {
    next(err)
  })

  
  }

};
