const express = require('express');
const router = express.Router();

const verifyAuth = require("../middleware/verifyAuth");

const controller = require('../controllers/timeMarkController');



// router.post('/create', controller.dataEntryPostCreate);
// router.post('/update/:id', controller.dataEntryUpdate);
// router.get('/:id', controller.dataEntryGet);
// router.delete('/:id', controller.dataEntryDelete);




module.exports = router;
