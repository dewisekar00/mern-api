const express = require('express');
// untuk mengambil body request
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const app = express();
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');

//1.tempat untuk menyimpan file photo dari client
const  fileStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, 'images')
  },
  filename: (req,file, cb) =>{
    cb(null, new Date().getTime() + '-' + file.originalname)
  }
})

//2.filter doc yang dikirim karena kita hanya akan menerima file image

const fileFilter = (req,file, cb) => {
if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ){
 cb(null, true)
}else{
  cb(null, false)
}
}


//3.menambahkan middleware
// yang akan diterima tipenya json
app.use(bodyParser.json());
//express.static:membuat folder static yang bisa diakses dari luar, __dirname: lokasi dimana project kita berada
//setiap kali ada pemanggilan /images maka akan disediakan url static untuk akses folder images
app.use('/images',express.static(path.join(__dirname, 'images')) )
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

// menambahkan middleware untuk menangkap setiap error message yang diberikan dan dikasih default error
app.use((error, req, res, next) => {
  // memberikan respon error yang dinamis
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});

mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://nanamint623:ZZtNXgVVolXSBxiG@cluster0.gzhjgib.mongodb.net/blog?retryWrites=true&w=majority').then(()=> {
  app.listen(3000, () => console.log('connection success'));
}).catch(err => console.log(err))




