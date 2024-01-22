const express = require('express')

const router = express.Router();
authControllers = require('../contollers/auth')

router.post('/register', authControllers.register )
module.exports = router;