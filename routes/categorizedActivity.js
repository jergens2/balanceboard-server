const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const controller = require('../controllers/categorizedActivityController');



router.post('/createDefault', controller.createDefault);
router.post('/create', controller.create);
router.post('/update', controller.update);
router.get('/get/:userId', controller.getByUserId);
router.post('/delete', controller.delete);




module.exports = router;
