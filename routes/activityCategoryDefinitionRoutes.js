const express = require('express');
const router = express.Router();

const controller = require('../controllers/activityCategoryDefinitionController');



router.post('/createDefault', controller.createDefault);
router.post('/create', controller.create);
router.post('/update', controller.update);
router.get('/get/:userId', controller.getByUserId);
router.post('/permanently-delete', controller.permanentlyDelete);




module.exports = router;
