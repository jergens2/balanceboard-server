const express = require('express');
const router = express.Router();

const friendRequestController = require('../controllers/friendRequestController');



router.post('/new-friend-request', friendRequestController.newRequest);
router.get('/get-requests/:socialId/', friendRequestController.getRequests);





module.exports = router;
