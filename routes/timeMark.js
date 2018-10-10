const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const controller = require('../controllers/timeMarkController');



router.post('/create', controller.create);
router.post('/update/:id', controller.update);
router.get('/:id', controller.get);
router.delete('/:id', controller.delete);




module.exports = router;
