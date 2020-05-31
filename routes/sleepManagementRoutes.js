const express = require('express');
const router = express.Router();
const controller = require('../controllers/sleepManagementController');

router.post( '/read', controller.read);
router.post( '/update', controller.update);
// router.post( '/delete', controller.delete);


module.exports = router;
