const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const controller = require('../controllers/timelogEntryController');


router.get('/month/:userId/:start', controller.getMonth);
router.get('/:userId/:start/:end', controller.get);
router.post('/create', controller.create);
router.post('/update', controller.update);

router.post('/delete', controller.delete);


router.get('/activity_data/:treeId', controller.getActivityData);


module.exports = router;
