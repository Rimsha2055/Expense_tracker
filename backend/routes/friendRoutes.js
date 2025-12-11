const express = require('express');
const router = express.Router();
const {
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  getFriends,
  removeFriend,
  sendInviteByEmail,
  acceptInvite,
  createInviteLink,
  createInviteCode,
  acceptInviteCode
} = require('../controllers/friendController');
const { protect } = require('../middleware/authMiddleware');
const { 
  validateFriendRequest 
} = require('../middleware/validationMiddleware');

// Accept invite via token (public)
router.get('/accept-invite', acceptInvite);

router.use(protect);

router.route('/')
  .get(getFriends)
  .post(validateFriendRequest, sendFriendRequest);

// Friend requests endpoints removed — adding friends is immediate

// Invite by email (protected)
router.route('/invite')
  .post(sendInviteByEmail);

// Create invite link (protected)
router.route('/create-invite')
  .post(createInviteLink);

// Create invite code (protected)
router.route('/create-code')
  .post(createInviteCode);

// Accept invite by code (protected) - user must be logged in to accept a code
router.route('/accept-code')
  .post(acceptInviteCode);

// (invite accept route already declared above)

// Request response route removed (no pending requests anymore)

router.route('/:friendId')
  .delete(removeFriend);

module.exports = router;