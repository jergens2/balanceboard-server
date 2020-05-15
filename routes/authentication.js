const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authenticationController');

//router.get('/', authenticationController.event_list);
//router.get('/:id', authenticationController.event_detail);

router.post('/authenticate', authenticationController.attemptLogin);
router.post('/register', authenticationController.startRegistration);
router.post('/finalize-registration', authenticationController.finalizeRegistration);
router.post('/resend-code', authenticationController.resendCode);
router.get('/check-for-existing/:email/:username', authenticationController.checkForExisting);
router.get('/getUserById/:id', authenticationController.getUserById);



module.exports = router;
