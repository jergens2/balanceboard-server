const express = require('express');
const router = express.Router();


const controller = require('../controllers/timelogEntryController');


router.get('/:userId/:start/:end', controller.get);
router.post('/create', controller.create);
router.post('/update', controller.update);

router.post('/delete', controller.delete);


module.exports = router;
