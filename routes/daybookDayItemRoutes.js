const express = require('express');
const router = express.Router();
const controller = require('../controllers/daybookDayItemController');


router.get('/:userId', controller.get);
router.get( '/:userId/:startDateYYYYMMDD/:endDateYYYYMMDD', controller.getInRange);
router.post( '/create', controller.create);
router.post( '/update', controller.update);
router.post( '/delete', controller.delete);

router.get('/get-all/:userId', controller.getAll);

module.exports = router;
