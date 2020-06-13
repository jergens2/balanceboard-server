const express = require('express');
const router = express.Router();

const userAccountProfileController = require('../controllers/userAccountProfileController');


router.post('/save', userAccountProfileController.save);
router.post('/get', userAccountProfileController.get)


module.exports = router;
