var crypto = require('crypto');
var express = require('express');
var request = require('request-promise');
var router = express.Router();

router.post('/', function(req, res, next) {
  if (!req.body.signed_request) {
    return res
      .status(400)
      .render('error', { message: `No signed request sent.` });
  }
  const parts = req.body.signed_request.split('.');
  if (parts.length !== 2) {
    return res
      .status(400)
      .render(
        'error',
        {
          message: `Signed request is malformatted: ${req.body.signed_request}`
        }
      );
  }
  const [signature, payload] = parts.map(value => base64url.decode(value));
  const expectedSignature = crypto.createHmac('sha256', process.env.APP_SECRET)
    .update(parts[1])
    .digest('hex');
  if (expectedSignature !== signature) {
    return res
      .status(400)
      .render(
        'error',
        {
          message: `Signed request does not match. Expected ${expectedSignature} but got ${signature}.`
        },
      );
  }

  // Signature matched, proceed with uninstall
  console.log(`Community ID: ${payload}`);
  return res.status(200);
});

module.exports = router;
