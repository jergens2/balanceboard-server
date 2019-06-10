const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const controller = require('../controllers/activityDayDataController');



router.get('/:userId/', controller.get);
// router.get('/get-by-date/:date' , controller.getByDate);
router.get('/:userId/:start/:end', controller.getByRange);

router.post('/create', controller.create);
router.post('/update', controller.update);
router.post('/update-by-date', controller.updateByDate);
router.post('/delete', controller.delete);



module.exports = router;
