const express = require('express');
const router = express.Router();
const controller = require('../controllers/daybookDayItemController');

const fs = require("fs");
const expressJwt = require('express-jwt');
const RSA_PUBLIC_KEY = fs.readFileSync('./key/public_key.key');
const checkIfAuthenticated = expressJwt({
  secret: RSA_PUBLIC_KEY,
});

router.get('/:userId', controller.get);
router.get( '/:userId/:startDateYYYYMMDD/:endDateYYYYMMDD', controller.getInRange);
router.post( '/create', controller.create);
router.post( '/update', controller.update);
router.post( '/delete', controller.delete);


module.exports = router;
