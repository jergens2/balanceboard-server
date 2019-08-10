const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const controller = require('../controllers/daybookDayItemController');



router.get('/:userId', controller.get);
router.get('/:userId/:startDateYYYYMMDD/:endDateYYYYMMDD', controller.getInRange);
router.post('/create', controller.create);
router.post('/update', controller.update);
router.post('/delete', controller.delete);



module.exports = router;
