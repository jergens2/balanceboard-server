var express = require('express');
var router = express.Router();

// Require controller modules.
var event_controller = require('../controllers/eventController');


// GET catalog home page.
router.get('/', event_controller.event_list);

router.post('/byDate', event_controller.event_date_post);
// GET request for creating a Event. NOTE This must come before routes that display Event (uses id).
//router.get('/create', event_controller.event_create_get);

// POST request for creating Event.
router.post('/create', event_controller.event_create_post);

// GET request to delete Event.
//router.get('/:id/delete', event_controller.event_delete_get);

// POST request to delete Event.
router.post('/:id/delete', event_controller.event_delete_post);

// GET request to update Event.
//router.get('/:id/update', event_controller.event_update_get);

// POST request to update Event.
router.post('/:id/update', event_controller.event_update_post);

// GET request for one Event.
router.get('/:id', event_controller.event_detail);

// GET request for list of all Event items.
//router.get('/events', event_controller.event_list);



module.exports = router;
