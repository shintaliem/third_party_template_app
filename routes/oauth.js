var express = require('express');
var request = require('request-promise');
var router = express.Router();

router.get('/', function(req, res, next) {
  let code = req.query['code'];
  if (code) {
    let community_id = authorize(code)
      .then(get_workplace_community)
    // Save access_token and community_id to DB
    console.log('Community: ' + community_id);
  }

  res.sendStatus(200);
});

// This is a dummy just to make sure the app is installed. and get the webhooks
function authorize(code) {
  let params = {
    "client_id": process.env.APP_ID,
    "redirect_uri":  process.env.SERVER_URL + "/oauth",
    "client_secret": process.env.APP_SECRET,
    "code": code
  }

  return request({
    "uri": 'https://graph.facebook.com/v2.12/oauth/access_token',
    "qs": params,
    "method": "GET",
  });
}

function get_workplace_community(oauth) {
  console.log(oauth);
  let time = (new Date().getTime()/1000|0);
  let appsecret_proof = CryptoJS.HmacSHA256(
    oauth.access_token + '|' + time,
    process.env.APP_SECRET
  );
  let params = {
    "access_token" : oauth.access_token,
    "appsecret_proof": appsecret_proof,
    "appsecret_time": time
  }

  request({
    "uri": 'https://graph.facebook.com/v2.12/community',
    "qs": params,
    "method": "GET",
  }).then(function(response) {
    console.log(response);
    return response.id;
  });
}

module.exports = router;