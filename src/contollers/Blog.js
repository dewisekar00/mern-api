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
      err.errorStatus = 400;
      err.data = errors.array();
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
  }
};
