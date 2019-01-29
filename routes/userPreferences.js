const express = require('express');
const router = express.Router();

const userSettingsController = require('../controllers/userSettingsController');


router.post('/save_settings', userSettingsController.save);



module.exports = router;
