const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const controller = require('../controllers/objectiveController');



router.get('/:userId', controller.get);
router.get('/:userId/:objectiveId', controller.getById)

router.post('/create', controller.create);
router.post('/update', controller.update);
router.post('/delete', controller.delete);



module.exports = router;
