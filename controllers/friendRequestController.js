
var ObjectId = require('mongoose').Types.ObjectId;
const FriendRequest = require('../models/friendRequest');


exports.newRequest = function (req, res, next) {
    const newRequest = new FriendRequest({
        requesterId: req.body.requesterId,
        recipientId: req.body.recipientId,
        dateISO: req.body.dateISO
    });
    newRequest.save((err, savedRequest) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error saving request object",
                data: err
            });
        }
        if (!savedRequest) {
            return res.status(500).json({ message: "Request not saved", data: newRequest });
        }
        return res.status(200).json({ message: "Successfully created new friend request", data: savedRequest });
    });
}
exports.getRequests = function (req, res, next) {
    FriendRequest.find(
        {
            $or: [
                {
                    'recipientId': req.params.socialId,
                },
                {
                    'requesterId': req.params.socialId,
                },
            ]
        }, (err, requests) => {
            if (err) {
                return res.status(500).json({
                    message: "DB Error finding friend requests object",
                    data: err
                });
            }
            if (!requests) {
                return res.status(500).json({ message: "Could not find any requests.", data: req.params.recipientId });
            }
            return res.status(200).json({ message: "Successfully found requests", data: requests });
        })
}