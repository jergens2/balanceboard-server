const express = require('express');
const router = express.Router();
const fs = require("fs");
const authenticationController = require('../controllers/authenticationController');

const expressJwt = require('express-jwt');

const RSA_PUBLIC_KEY = fs.readFileSync('key/public_key.key');
const checkIfAuthenticated = expressJwt({
  secret: RSA_PUBLIC_KEY,
});


router.post('/authenticate', authenticationController.attemptLogin);
router.post('/pin-unlock', authenticationController.pinUnlock)

router.post('/register', authenticationController.startRegistration);
router.get('/check-for-existing/:email/:username', authenticationController.checkForExisting);
router.post('/finalize-registration', authenticationController.finalizeRegistration);
router.post('/resend-code', authenticationController.resendCode);
router.post('/forgot-password', authenticationController.forgotPassword);

router.post('/refresh-token', checkIfAuthenticated, authenticationController.refreshToken);

router.get('/getUserById/:id', authenticationController.getUserById);



module.exports = router;
