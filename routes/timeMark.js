const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const controller = require('../controllers/timeMarkController');


router.get('/month/:userId/:start', controller.getMonth);
router.get('/:userId/:start/:end', controller.get);
router.post('/create', controller.create);
router.post('/update/:id', controller.update);

router.post('/delete', controller.delete);

// router.get('/month/:userId/:start', controller.getMonth);


module.exports = router;
