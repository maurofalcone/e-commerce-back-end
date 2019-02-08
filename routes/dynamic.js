var express = require('express');
var router = express.Router();

router.get('/hello', function (req,res) {
  var html = '<h1> Hello World!'+Date.now();
  html += '<img src= "http://localhost:3000/static/logo.png" >';
  html+= '</h1>';
  res.send(html);
});

module.exports = router;
