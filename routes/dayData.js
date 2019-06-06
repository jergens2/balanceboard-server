const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const controller = require('../controllers/dayDataController');



router.get('/:userId/', controller.get);
router.get('/:userId/:date' , controller.getByDate);
router.get('/:userId/:start/:end', controller.getByRange);

router.post('/create', controller.create);
router.post('/update', controller.update);
router.post('/delete', controller.delete);



module.exports = router;
