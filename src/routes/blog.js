const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const blogController = require('../contollers/Blog');


router.post('/post', 
[body('title').
isLength({ min: 2 })
.withMessage('minimum title input is 2 length'), 
body('body')
.isLength({ min: 3 })
.withMessage('minimum body input is 3 length')],
 blogController.createBlogPost);

module.exports = router;


// memberikan pagination dengan query params
router.get('/posts', blogController.getAllBlogPost)
router.get('/post/:postId', blogController.getBlogPostByID)

router.put('/post/:postId', 
[body('title')
.isLength({ min: 2 })
.withMessage('minimum title input is 2 length'), 
body('body')
.isLength({ min: 3 })
.withMessage('minimum body input is 3 length')],
 blogController.updateBlogPost)

 router.delete('/post/:postId', blogController.deletBlogPostById)



 
// alur menambahkan express validator
/*
1.require express-validator dan apa yang mau dikasih validasi disini contohnya adalah isi body
2.tambahkan validator chaining di dalam route
3.lalu tambahkan validatorResult di controleres
4.tambahkan error respon middleware di index js



alur kode:
-buat route
-buat controllers

*/

