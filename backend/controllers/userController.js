const User = require('../models/User');
const Friendship = require('../models/Friendship');
const { Op } = require('sequelize');

// @desc Get all users excluding current user, with friendship status
// @route GET /api/user/all
// @access Private
const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user && req.user.id;

    // Fetch all users except current
    const users = await User.findAll({
      where: currentUserId ? { id: { [Op.ne]: currentUserId } } : {},
      attributes: ['id', 'username', 'email', 'fullName']
    });

    // Load friendships involving current user (if authenticated)
    let friendships = [];
    if (currentUserId) {
      friendships = await Friendship.findAll({
        where: {
          [Op.or]: [
            { userId: currentUserId },
            { friendId: currentUserId }
          ]
        }
      });
    }

    const usersWithStatus = users.map(u => {
      let status = 'none';

      if (currentUserId) {
        // find friendship record between currentUserId and this user
        const rel = friendships.find(f => (f.userId === currentUserId && f.friendId === u.id) || (f.friendId === currentUserId && f.userId === u.id));
        if (rel) {
          if (rel.status === 'accepted') status = 'friend';
          else if (rel.status === 'pending') {
            // determine direction
            if (rel.userId === currentUserId) status = 'pending_outgoing';
            else if (rel.friendId === currentUserId) status = 'pending_incoming';
          } else {
            status = rel.status || 'none';
          }
        }
      }

      return {
        id: u.id,
        username: u.username,
        email: u.email,
        fullName: u.fullName,
        friendshipStatus: status
      };
    });

    res.json({ success: true, data: usersWithStatus });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getAllUsers };
