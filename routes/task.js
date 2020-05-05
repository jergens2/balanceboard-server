const express = require('express');
const router = express.Router();


const controller = require('../controllers/taskController');



router.get('/:userId', controller.get);
router.get('/:userId/:taskId', controller.getById)

router.post('/create', controller.create);
router.post('/update', controller.update);
router.post('/delete', controller.delete);



module.exports = router;
