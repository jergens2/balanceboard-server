const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const genericDataController = require('../controllers/genericDataController');

// router.get('/', genericDataController.event_list);
// router.get('/:id', genericDataController.event_detail);

// router.post('/byDate', verifyAuth, event_controller.event_date_post);
// router.post('/create', verifyAuth, event_controller.event_create_post);
// router.post('/:id/delete', verifyAuth, event_controller.event_delete_post);
// router.post('/:id/update', verifyAuth, event_controller.event_update_post);

//router.post('/byDate', genericDataController.event_date_post);

router.post('/create', genericDataController.dataEntryPostCreate);
router.post('/update/:id', genericDataController.dataEntryUpdate);
router.get('/:id', genericDataController.dataEntryGet);
router.get('/byUser/:userId', genericDataController.dataEntryGetByUser)
router.delete('/:id', genericDataController.dataEntryDelete);




module.exports = router;
