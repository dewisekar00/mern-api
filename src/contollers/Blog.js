const { validationResult } = require('express-validator');
const BlogPost = require('../models/blog');
const path = require('path');
const fs = require('fs');

module.exports = {
  createBlogPost: (req, res, next) => {
    // Validasi data yang diterima dari request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Jika terdapat kesalahan validasi, buat objek error
      const err = new Error('Invalid value');
      err.errorStatus = 400;
      err.data = errors.array();
      // Lemparkan error untuk menandakan adanya kesalahan
      throw err;
    }

    // Pengecekan apakah ada file gambar yang di-upload
    if (!req.file) {
      // Jika tidak ada file, buat objek error
      const err = new Error('Image should upload');
      err.errorStatus = 422;
      // Lemparkan error untuk menandakan adanya kesalahan
      throw err;
    }

    // Jika validasi dan pengecekan file berjalan lancar, ambil data dari request
    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;

    // Buat objek Posting dari model BlogPost dengan data yang diambil
    const Posting = new BlogPost({
      title: title,
      body: body,
      image: image,
      author: { id: 1, name: 'anna' },
    });

    // Simpan data ke database
    Posting.save()
      .then((result) => {
        // Jika penyimpanan berhasil, kirim respons sukses
        res.status(201).json({
          message: 'Create Blog Post success',
          data: result,
        });
      })
      .catch((err) => {
        // Jika terjadi kesalahan selama penyimpanan, tampilkan kesalahan pada console
        console.log(err);
      });
  },

  getAllBlogPost: (req, res, next) => {
    // 1.cara menggunakan query params untuk pagination
    // kalo user ngga memanggil query maka set default jadi 1
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    // 2.ada berapa sih jumlah data kita
    let totalItem;
    // 3.manggil data dari mongoDB tapi dihitung dulu berapa jumlah data yang dimiliki

    BlogPost.find()
      .countDocuments()
      .then((count) => {
        // sekarang totalCount berisi count dari db
        totalItem = count;
        /*manggil beberapa data aja,maksud kode ini misal: >page 1 - 1 = 0 * perPage(5) = 0 page > page 2 - 1 = 1 * 5 = 5 data, > page 3-1 = 2  5 = 10 langsung skip ke data no 10 dst , jadi di page 3 misal data yang tampil itu dimulai dari no 11 karena yang diskip 10  */

        // return untuk membuat promise baru, 1.panggil data
        return (
          BlogPost.find()
            //2.buat pagination
            .skip((parseInt(currentPage) - 1) * parseInt(perPage))
            .limit(parseInt(perPage))
        );
      })
      .then((result) => {
        res.status(200).json({
          message: 'Data Blog Post Berhasil di panggil',
          data: result,
          total_data: totalItem,
          per_page: parseInt(perPage),
          current_page: parseInt(currentPage),
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  getBlogPostByID: (req, res, next) => {
    const postId = req.params.postId;
    BlogPost.findById(postId)
      .then((result) => {
        if (!result) {
          // jika user masukin id yang salah/id yang ngga ada didatabase maka dia akan tetap masuk ke then dan ditangani dengan ini
          const error = new Error('Blog Post Tidak ditemukan');
          error.errorStatus = 404;
          throw error;
        }
        // kalo ada id nya masuk ke code ini
        res.status(200).json({
          message: 'Data Blog Post Berhasil dipanggil',
          data: result,
        });
      })
      .catch((err) => {
        //jika error akan dihandle di depan
        next(err);
      });
  },

  updateBlogPost: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Invalid value');
      err.errorStatus = 400;
      err.data = errors.array();
      throw err;
    }

    if (!req.file) {
      const err = new Error('Image should upload');
      err.errorStatus = 422;
      throw err;
    }

    const postId = req.params.postId;
    //then 1 untuk mencari data postingan
    BlogPost.findById(postId)
      .then((post) => {
        if (!post) {
          const err = new Error('Blog Post Tidak ditemukan');
          err.errorStatus = 404;
          throw err;
        }
        // Update post properties
        post.title = req.body.title;
        post.image = req.file.path;
        post.body = req.body.body;
        // Save the updated post
        return post.save();
      })

      .then((result) => {
        res.status(200).json({
          message: 'Update Postingan Success',
          data: result,
        });
      })

      .catch((err) => {
        next(err);
      });
  },

  deletBlogPostById: (req, res, next) => {
    const postId = req.params.postId;
    let deletePost;

    BlogPost.findById(postId)
      .then((post) => {
        if (!post) {
          const error = new Error('Blog Post tidak ditemukan');
          error.errorStatus = 404;
          throw error;
        }

        deletePost = post;
        //hapus image
        removeImage(post.image);
        return BlogPost.findByIdAndRemove(postId);
      })
      .then(() => {
        res.status(200).json({
          message: 'Delete Success',
          data: deletePost,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
};

//hapus image
const removeImage = (filePath) => {
  console.log(filePath);
  //untuk mengetahui filenya dimana
  console.log(__dirname);
  //menggabungkan lokasi controllers dan images
  filePath = path.join(__dirname, '../..', filePath);
  //remove path
  fs.unlink(filePath, (err) => console.log(err));
};

//proses delete:hapus image dulu baru postingannya
