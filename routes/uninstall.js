var crypto = require('crypto');
var express = require('express');
var request = require('request-promise');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log(req.body.signed_request);
});

module.exports = router;
