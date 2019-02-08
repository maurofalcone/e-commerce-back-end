var cors = require('cors');
var express = require('express');
var products = require('./products');
var users = require('./users')
var router = express.Router();

router.use(cors());

router.use('/products', products);
router.use('/users', users);

module.exports = router;
