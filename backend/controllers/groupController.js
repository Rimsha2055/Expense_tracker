const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/User');
const Expense = require('../models/Expense');
const ExpenseSplit = require('../models/ExpenseSplit');
const Settlement = require('../models/Settlement');
const { Op } = require('sequelize');

// @desc    Create group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds = [] } = req.body;
    
    // Create group
    const group = await Group.create({
      name,
      description,
      createdBy: req.user.id
    });
    
    // Add creator as owner
    await GroupMember.create({
      groupId: group.id,
      userId: req.user.id,
      role: 'owner'
    });
    
    // Add members
    if (memberIds.length > 0) {
      const members = memberIds.map(userId => ({
        groupId: group.id,
        userId,
        role: 'member'
      }));
      
      await GroupMember.bulkCreate(members);
    }
    
    // Get group with members
    const createdGroup = await Group.findByPk(group.id, {
      include: [{
        model: GroupMember,
        as: 'members',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'fullName']
        }]
      }]
    });
    
    res.status(201).json({
      success: true,
      data: createdGroup
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
const getGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: [{
        model: GroupMember,
        as: 'members',
        where: { userId: req.user.id },
        required: true
      }, {
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'email']
      }]
    });
    
    res.json({
      success: true,
      data: groups
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Private
const getGroup = async (req, res) => {
  try {
    const group = await Group.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: GroupMember,
          as: 'members',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'fullName']
          }]
        },
        {
          model: Expense,
          as: 'expenses',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            },
            {
              model: ExpenseSplit,
              as: 'splits',
              include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'username']
              }]
            }
          ],
          order: [['expenseDate', 'DESC']]
        }
      ]
    });
    
    if (!group) {
      return res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }
    
    // Check if user is member
    const isMember = await GroupMember.findOne({
      where: {
        groupId: group.id,
        userId: req.user.id
      }
    });
    
    if (!isMember) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this group' 
      });
    }
    
    // Calculate group balances
    const expenses = await Expense.findAll({
      where: { groupId: group.id },
      include: [{
        model: ExpenseSplit,
        as: 'splits',
        include: [{
          model: User,
          as: 'user'
        }]
      }]
    });
    
    // Calculate balances
    const balances = {};
    
    expenses.forEach(expense => {
      expense.splits.forEach(split => {
        const creditorId = expense.userId;
        const debtorId = split.userId;
        const amount = parseFloat(split.amount);
        
        if (creditorId !== debtorId) {
          if (!balances[creditorId]) balances[creditorId] = {};
          if (!balances[creditorId][debtorId]) balances[creditorId][debtorId] = 0;
          balances[creditorId][debtorId] += amount;
        }
      });
    });
    
    // Simplify balances (A owes B, B owes A)
    const simplifiedBalances = [];
    const processedPairs = new Set();
    
    for (const creditorId in balances) {
      for (const debtorId in balances[creditorId]) {
        const pairKey = [creditorId, debtorId].sort().join('-');
        
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          
          const amount1 = balances[creditorId][debtorId] || 0;
          const amount2 = balances[debtorId] ? (balances[debtorId][creditorId] || 0) : 0;
          const netAmount = amount1 - amount2;
          
          if (netAmount !== 0) {
            simplifiedBalances.push({
              fromId: netAmount > 0 ? debtorId : creditorId,
              toId: netAmount > 0 ? creditorId : debtorId,
              amount: Math.abs(netAmount)
            });
          }
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        ...group.toJSON(),
        balances: simplifiedBalances
      }
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Add member to group
// @route   POST /api/groups/:id/members
// @access  Private
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const group = await Group.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }
    
    // Check if user has permission (owner/admin)
    const member = await GroupMember.findOne({
      where: {
        groupId: group.id,
        userId: req.user.id
      }
    });
    
    if (!member || !['owner', 'admin'].includes(member.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to add members' 
      });
    }
    
    // Check if user already a member
    const existingMember = await GroupMember.findOne({
      where: {
        groupId: group.id,
        userId
      }
    });
    
    if (existingMember) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already in group' 
      });
    }
    
    // Add member
    await GroupMember.create({
      groupId: group.id,
      userId,
      role: 'member'
    });
    
    res.json({
      success: true,
      message: 'Member added successfully'
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Remove member from group
// @route   DELETE /api/groups/:id/members/:userId
// @access  Private
const removeMember = async (req, res) => {
  try {
    const { id: groupId, userId } = req.params;
    
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }
    
    // Check if user has permission (owner/admin) or removing self
    const requester = await GroupMember.findOne({
      where: {
        groupId,
        userId: req.user.id
      }
    });
    
    const targetMember = await GroupMember.findOne({
      where: {
        groupId,
        userId
      }
    });
    
    if (!targetMember) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found in group' 
      });
    }
    
    // Allow removal if: owner removing anyone, admin removing member (not owner/admin), or removing self
    const isOwner = requester?.role === 'owner';
    const isAdmin = requester?.role === 'admin';
    const isRemovingSelf = req.user.id === userId;
    const isTargetOwner = targetMember.role === 'owner';
    const isTargetAdmin = targetMember.role === 'admin';
    
    if (!isRemovingSelf) {
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to remove members' 
        });
      }
      
      if (isAdmin && (isTargetOwner || isTargetAdmin)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Admins cannot remove other admins or owners' 
        });
      }
    }
    
    // Cannot remove the last owner
    if (isTargetOwner) {
      const ownerCount = await GroupMember.count({
        where: {
          groupId,
          role: 'owner'
        }
      });
      
      if (ownerCount <= 1) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot remove the last owner' 
        });
      }
    }
    
    await targetMember.destroy();
    
    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Create group expense
// @route   POST /api/groups/:id/expenses
// @access  Private
const createGroupExpense = async (req, res) => {
  try {
    const { 
      title, 
      amount, 
      description, 
      categoryId, 
      expenseDate, 
      splits 
    } = req.body;
    
    const group = await Group.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ 
        success: false, 
        message: 'Group not found' 
      });
    }
    
    // Check if user is group member
    const isMember = await GroupMember.findOne({
      where: {
        groupId: group.id,
        userId: req.user.id
      }
    });
    
    if (!isMember) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to add expenses to this group' 
      });
    }
    
    // Create expense
    const expense = await Expense.create({
      title,
      amount: parseFloat(amount),
      description,
      categoryId: categoryId || null,
      expenseDate: expenseDate || new Date(),
      userId: req.user.id,
      groupId: group.id,
      isShared: true
    });
    
    // Create splits
    const splitPromises = splits.map(split => 
      ExpenseSplit.create({
        expenseId: expense.id,
        userId: split.userId,
        amount: split.amount,
        sharePercentage: split.sharePercentage,
        isPaid: split.isPaid || false
      })
    );
    
    await Promise.all(splitPromises);
    
    // Get created expense with details
    const createdExpense = await Expense.findByPk(expense.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: ExpenseSplit,
          as: 'splits',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }]
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      data: createdExpense
    });
  } catch (error) {
    console.error('Create group expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Settle expense
// @route   POST /api/expenses/:id/settle
// @access  Private
const settleExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [{
        model: ExpenseSplit,
        as: 'splits'
      }]
    });
    
    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found' 
      });
    }
    
    // Mark user's split as paid
    const userSplit = await ExpenseSplit.findOne({
      where: {
        expenseId: expense.id,
        userId: req.user.id
      }
    });
    
    if (!userSplit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Split not found' 
      });
    }
    
    await userSplit.update({
      isPaid: true,
      paidAt: new Date()
    });
    
    res.json({
      success: true,
      data: userSplit
    });
  } catch (error) {
    console.error('Settle expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get balances endpoint
const getGroupBalances = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const members = await GroupMember.findAll({ where: { groupId: group.id } });
    const memberIds = members.map(m => m.userId);

    const expenses = await Expense.findAll({ where: { groupId: group.id }, include: [{ model: ExpenseSplit, as: 'splits' }] });

    const balances = {};
    for (const id of memberIds) balances[id] = { paid: 0, share: 0 };

    for (const exp of expenses) {
      balances[exp.userId].paid += parseFloat(exp.amount);
      for (const sp of exp.splits) {
        balances[sp.userId].share += parseFloat(sp.amount);
      }
    }

    // Debug logs to trace balance calculation
    console.log('[getGroupBalances] memberIds:', memberIds);
    console.log('[getGroupBalances] expenses.length:', expenses.length);
    console.log('[getGroupBalances] balances raw:', JSON.stringify(balances));

    const results = Object.keys(balances).map(uid => ({ userId: uid, paid: balances[uid].paid, share: balances[uid].share, net: parseFloat((balances[uid].paid - balances[uid].share).toFixed(2)) }));

    console.log('[getGroupBalances] results:', JSON.stringify(results));

    // Produce settlement suggestions
    const creditors = results.filter(r => r.net > 0).sort((a,b)=>b.net-a.net);
    const debtors = results.filter(r => r.net < 0).map(d => ({...d, net: -d.net})).sort((a,b)=>b.net-a.net);
    const settlements = [];
    let i=0,j=0;
    while (i<debtors.length && j<creditors.length) {
      const debit = debtors[i];
      const credit = creditors[j];
      const amt = Math.min(debit.net, credit.net);
      settlements.push({ from: debit.userId, to: credit.userId, amount: parseFloat(amt.toFixed(2)) });
      debit.net -= amt; credit.net -= amt;
      if (Math.abs(debit.net) < 0.01) i++; if (Math.abs(credit.net) < 0.01) j++;
    }

    res.json({ success: true, data: { balances: results, settlements } });
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Settle between two users in a group (record settlement)
const settleGroup = async (req, res) => {
  try {
    const { payerId, payeeId, amount, note } = req.body;
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    // Verify both are members
    const a = await GroupMember.findOne({ where: { groupId: group.id, userId: payerId } });
    const b = await GroupMember.findOne({ where: { groupId: group.id, userId: payeeId } });
    if (!a || !b) return res.status(400).json({ success: false, message: 'Both payer and payee must be group members' });

    // Record settlement
    const settlement = await Settlement.create({ groupId: group.id, payerId, payeeId, amount, note });

    res.status(201).json({ success: true, data: settlement });
  } catch (error) {
    console.error('Settle group error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroup,
  addMember,
  removeMember,
  createGroupExpense,
  settleExpense,
  getGroupBalances,
  settleGroup
};

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private (owner only)
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    // Check permission: only owner can delete
    const requester = await GroupMember.findOne({ where: { groupId: group.id, userId: req.user.id } });
    if (!requester || requester.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this group' });
    }

    // Find expenses for group
    const expenses = await Expense.findAll({ where: { groupId: group.id }, attributes: ['id'] });
    const expenseIds = expenses.map(e => e.id);

    // Delete expense splits
    if (expenseIds.length > 0) {
      await ExpenseSplit.destroy({ where: { expenseId: { [Op.in]: expenseIds } } });
    }

    // Delete expenses
    await Expense.destroy({ where: { groupId: group.id } });

    // Delete settlements
    await Settlement.destroy({ where: { groupId: group.id } });

    // Delete group members
    await GroupMember.destroy({ where: { groupId: group.id } });

    // Finally delete group
    await Group.destroy({ where: { id: group.id } });

    res.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Export deleteGroup after declaration to avoid temporal dead zone issues
module.exports.deleteGroup = deleteGroup;