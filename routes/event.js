var express = require('express');
var router = express.Router();

var event_controller = require('../controllers/eventController');

router.get('/', event_controller.event_list);
router.get('/:id', event_controller.event_detail);

router.post('/byDate', event_controller.event_date_post);
router.post('/create', event_controller.event_create_post);
router.post('/:id/delete', event_controller.event_delete_post);
router.post('/:id/update', event_controller.event_update_post);



module.exports = router;
