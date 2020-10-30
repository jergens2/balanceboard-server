const express = require('express');
const router = express.Router();

const controller = require('../controllers/notebookEntryController');



router.get('/:userId', controller.get);
router.get('/:userId/:startISO', controller.getRange)

router.post('/create', controller.create);
router.post('/update', controller.update);
router.post('/delete', controller.delete);



module.exports = router;
