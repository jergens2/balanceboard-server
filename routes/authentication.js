const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authenticationController');

//router.get('/', authenticationController.event_list);
//router.get('/:id', authenticationController.event_detail);

router.post('/authenticate', authenticationController.authenticate);
router.post('/register', authenticationController.register);
router.get('/validateNewEmail/:email', authenticationController.validateNewEmail);
router.get('/getUserById/:id', authenticationController.getUserById);



module.exports = router;
