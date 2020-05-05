const express = require('express');
const router = express.Router();

const fs = require("fs");
const expressJwt = require('express-jwt');
const RSA_PUBLIC_KEY = fs.readFileSync('./key/public_key.key');
const checkIfAuthenticated = expressJwt({
  secret: RSA_PUBLIC_KEY,
});

const controller = require('../controllers/activityCategoryDefinitionController');



router.post('/createDefault', controller.createDefault);
router.post('/create', controller.create);
router.post('/update', controller.update);
router.get('/get/:userId', controller.getByUserId);
router.post('/delete', controller.delete);




module.exports = router;
