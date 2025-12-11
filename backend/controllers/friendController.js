const Friendship = require('../models/Friendship');
const User = require('../models/User');
const { Op } = require('sequelize');
const FriendInvite = require('../models/FriendInvite');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// @desc    Send friend request
// @route   POST /api/friends/request
// @access  Private
const sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;

    // Check if trying to add self
    if (friendId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add yourself as friend'
      });
    }

    // Check if friend exists
    const friend = await User.findByPk(friendId);
    if (!friend) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if friendship already exists (either direction)
    const existing = await Friendship.findOne({
      where: {
        [Op.or]: [
          { userId: req.user.id, friendId },
          { userId: friendId, friendId: req.user.id }
        ]
      }
    });

    // If friendship already exists, ensure it is accepted both ways and return success
    if (existing) {
      // If already accepted, return success (idempotent)
      if (existing.status === 'accepted') {
        const friendDetails = await User.findByPk(friendId, { attributes: ['id', 'username', 'email', 'fullName'] });
        return res.json({ success: true, message: 'Already friends', data: { friend: friendDetails } });
      }

      // If it's pending (any direction) or other, set to accepted both ways
      await existing.update({ status: 'accepted' });
      const reciprocal = await Friendship.findOne({ where: { userId: req.user.id, friendId } });
      if (!reciprocal) {
        await Friendship.create({ userId: req.user.id, friendId, status: 'accepted' });
      } else {
        await reciprocal.update({ status: 'accepted' });
      }

      const friendDetails = await User.findByPk(friendId, { attributes: ['id', 'username', 'email', 'fullName'] });
      return res.json({ success: true, message: 'Friend added', data: { friend: friendDetails } });
    }

    // No existing friendship -> create mutual accepted friendship immediately
    const created = await Friendship.create({ userId: req.user.id, friendId, status: 'accepted' });
    const createdReciprocal = await Friendship.create({ userId: friendId, friendId: req.user.id, status: 'accepted' });

    // Load friend details for response
    const friendDetails = await User.findByPk(friendId, { attributes: ['id', 'username', 'email', 'fullName'] });

    res.status(201).json({ success: true, data: { friendship: created, reciprocal: createdReciprocal, friend: friendDetails } });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get friend requests
// @route   GET /api/friends/requests
// @access  Private
const getFriendRequests = async (req, res) => {
  try {
    const requests = await Friendship.findAll({
      where: {
        friendId: req.user.id,
        status: 'pending'
      },
      include: [{
        model: User,
        as: 'requester',
        attributes: ['id', 'username', 'email', 'fullName']
      }]
    });
    
    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Respond to friend request
// @route   PUT /api/friends/requests/:id/respond
// @access  Private
const respondToFriendRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    
    const friendship = await Friendship.findOne({
      where: {
        id: req.params.id,
        friendId: req.user.id,
        status: 'pending'
      }
    });
    
    if (!friendship) {
      return res.status(404).json({ 
        success: false, 
        message: 'Friend request not found' 
      });
    }
    
    // Update status
    await friendship.update({ status });
    
    // If accepted, create reciprocal friendship
    if (status === 'accepted') {
      await Friendship.create({
        userId: req.user.id,
        friendId: friendship.userId,
        status: 'accepted'
      });
    }
    
    res.json({
      success: true,
      data: friendship
    });
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get all friends
// @route   GET /api/friends
// @access  Private
const getFriends = async (req, res) => {
  try {
    const friends = await Friendship.findAll({
      where: {
        userId: req.user.id,
        status: 'accepted'
      },
      include: [{
        model: User,
        as: 'receiver',
        attributes: ['id', 'username', 'email', 'fullName']
      }]
    });
    
    res.json({
      success: true,
      data: friends
    });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Remove friend
// @route   DELETE /api/friends/:friendId
// @access  Private
const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    
    // Delete both directions of friendship
    await Friendship.destroy({
      where: {
        [Op.or]: [
          { userId: req.user.id, friendId },
          { userId: friendId, friendId: req.user.id }
        ]
      }
    });
    
    res.json({
      success: true,
      message: 'Friend removed successfully'
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Export controller functions (moved to end to include invite handlers)

// @desc    Create invite link (no SMTP needed)
// @route   POST /api/friends/create-invite
// @access  Private
const createInviteLink = async (req, res) => {
  try {
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const invite = await FriendInvite.create({ inviterId: req.user.id, email: req.user.email, token, expiresAt });

    const inviteLink = `${FRONTEND_URL}/friends/accept-invite?token=${invite.token}`;

    res.status(201).json({ success: true, data: { inviteLink, token: invite.token, expiresAt } });
  } catch (error) {
    console.error('Create invite link error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create a short friend code (FRIEND-XXXXXXXX)
// @route   POST /api/friends/create-code
// @access  Private
const createInviteCode = async (req, res) => {
  try {
    const token = crypto.randomBytes(24).toString('hex');
    const codeSuffix = token.slice(0, 8).toUpperCase();
    const code = `FRIEND-${codeSuffix}`;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    // Store inviter email for debugging/tracking; acceptance by code does not require email match
    const invite = await FriendInvite.create({ inviterId: req.user.id, email: req.user.email, token, expiresAt });

    res.status(201).json({ success: true, data: { code, token: invite.token, expiresAt } });
  } catch (error) {
    console.error('Create invite code error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Accept invite using a friend code
// @route   POST /api/friends/accept-code
// @access  Private
const acceptInviteCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required' });

    const normalized = String(code).trim().toUpperCase();
    if (!normalized.startsWith('FRIEND-')) return res.status(400).json({ success: false, message: 'Invalid code format' });

    const suffix = normalized.replace('FRIEND-', '');
    if (!/^[0-9A-F]+$/.test(suffix)) return res.status(400).json({ success: false, message: 'Invalid code format' });

    // Find invite where token starts with the suffix (case-insensitive)
    const invite = await FriendInvite.findOne({
      where: {
        token: {
          [Op.like]: `${suffix.toLowerCase()}%`
        }
      }
    });

    if (!invite) return res.status(404).json({ success: false, message: 'Invite code not found' });
    if (new Date() > new Date(invite.expiresAt)) return res.status(400).json({ success: false, message: 'Invite expired' });

    // Prevent self-accept
    if (invite.inviterId === req.user.id) return res.status(400).json({ success: false, message: 'Cannot accept your own invite' });

    // Create friendship both ways if not exist
    const exists = await Friendship.findOne({ where: { userId: invite.inviterId, friendId: req.user.id } });
    if (!exists) {
      await Friendship.create({ userId: invite.inviterId, friendId: req.user.id, status: 'accepted' });
    }
    const existsReverse = await Friendship.findOne({ where: { userId: req.user.id, friendId: invite.inviterId } });
    if (!existsReverse) {
      await Friendship.create({ userId: req.user.id, friendId: invite.inviterId, status: 'accepted' });
    }

    // delete invite after use
    await invite.destroy();

    res.json({ success: true, message: 'Friend added successfully' });
  } catch (error) {
    console.error('Accept invite code error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Send invite by email
// @route   POST /api/friends/invite
// @access  Private
const sendInviteByEmail = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    email = String(email).trim().toLowerCase();

    if (email === String(req.user.email).toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Cannot invite yourself' });
    }

    // Reuse existing non-expired invite if present
    const existingInvite = await FriendInvite.findOne({
      where: {
        inviterId: req.user.id,
        email,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    let invite;
    if (existingInvite) {
      invite = existingInvite;
    } else {
      // create token
      const token = crypto.randomBytes(24).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

      invite = await FriendInvite.create({ inviterId: req.user.id, email, token, expiresAt });
    }

    const acceptUrl = `${FRONTEND_URL}/invite/accept?token=${invite.token}`;

    // send email (try nodemailer config from env, else console.log)
    try {
      // Choose transporter: SendGrid (API key) -> SMTP, else custom SMTP
      let transporter;
      if (process.env.SENDGRID_API_KEY) {
        transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY }
        });
      } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
      } else {
        // No SMTP configured — do not pretend email was sent. Return acceptUrl so caller can copy.
        console.warn('No SMTP configured. Returning acceptUrl in response.');
        return res.status(201).json({ success: true, data: { inviteId: invite.id, acceptUrl, warning: 'No SMTP configured. Copy the acceptUrl to share.' } });
      }

      const fromAddress = process.env.SMTP_FROM || process.env.MAIL_FROM || 'no-reply@expense-tracker.local';
      const textBody = `${req.user.username} invited you to ExpenseTracker. Accept invite: ${acceptUrl}`;
      const htmlBody = `<p>${req.user.username} invited you to connect on ExpenseTracker.</p><p><a href="${acceptUrl}">Accept invite</a></p>`;

      const mailOptions = {
        from: fromAddress,
        to: email,
        subject: `${req.user.username} invited you to ExpenseTracker`,
        text: textBody,
        html: htmlBody,
        headers: {
          'X-Mailer': 'ExpenseTracker',
        }
      };

      const info = await transporter.sendMail(mailOptions);
      // nodemailer returns info.messageId and sometimes accepted/rejected
      console.log('Invite send info:', { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected, response: info.response });
      if (info && (info.messageId || (info.accepted && info.accepted.length))) {
        return res.status(201).json({ success: true, data: { inviteId: invite.id, acceptUrl } });
      } else {
        console.error('Invite send returned no messageId / accepted list:', info);
        return res.status(500).json({ success: false, message: 'Failed to send invite email', data: { acceptUrl } });
      }
    } catch (mailErr) {
      console.error('Failed to send invite email', mailErr);
      return res.status(500).json({ success: false, message: 'Failed to send invite email', error: mailErr.message, data: { acceptUrl } });
    }

    res.status(201).json({ success: true, data: { inviteId: invite.id, acceptUrl } });
  } catch (error) {
    console.error('Send invite error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Accept invite via token
// @route   GET /api/friends/invite/accept
// @access  Public
const acceptInvite = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

    const invite = await FriendInvite.findOne({ where: { token } });
    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
    if (new Date() > new Date(invite.expiresAt)) {
      return res.status(400).json({ success: false, message: 'Invite expired' });
    }

    // find user by email
    const recipient = await User.findOne({ where: { email: invite.email } });

    if (!recipient) {
      // Not registered yet - inform frontend to prompt signup with token
      return res.json({ success: true, data: { message: 'User not registered', email: invite.email, token } });
    }

    // Create friendship both ways if not exist
    const exists = await Friendship.findOne({ where: { userId: invite.inviterId, friendId: recipient.id } });
    if (!exists) {
      await Friendship.create({ userId: invite.inviterId, friendId: recipient.id, status: 'accepted' });
    }
    const existsReverse = await Friendship.findOne({ where: { userId: recipient.id, friendId: invite.inviterId } });
    if (!existsReverse) {
      await Friendship.create({ userId: recipient.id, friendId: invite.inviterId, status: 'accepted' });
    }

    // delete invite after use
    await invite.destroy();

    res.json({ success: true, message: 'Invite accepted and friendship created' });
  } catch (error) {
    console.error('Accept invite error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};