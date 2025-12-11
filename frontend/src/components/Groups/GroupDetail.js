import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService } from '../../services/groups';
import { friendService } from '../../services/friends';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/currency';
import { FiX, FiPlus, FiDollarSign, FiUsers, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [friends, setFriends] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Load group data
  const fetchGroupData = async () => {
    try {
      const res = await groupService.getGroup(id);
      if (res.success) {
        setGroup(res.data);
        setMembers(res.data.members || []);
        setExpenses(res.data.expenses || []);
      }
    } catch (error) {
      toast.error('Failed to load group');
      navigate('/groups');
    }
  };

  // Load balances
  const fetchBalances = async () => {
    try {
      const res = await groupService.getGroupBalances(id);
      console.log('[GroupDetail] getGroupBalances response:', res);
      if (res.success) {
        setBalances(res.data.balances || []);
        setSettlements(res.data.settlements || []);
        const me = (res.data.balances || []).find(b => String(b.userId) === String(user?.id));
        console.log('[GroupDetail] computed me balance entry:', me);
        if (me) console.log('[GroupDetail] me.net, paid, share:', me.net, me.paid, me.share);
      }
    } catch (error) {
      console.error('Failed to load balances', error);
    }
  };

  // Load friends
  const fetchFriends = async () => {
    try {
      const res = await friendService.getFriends();
      if (res.success) {
        setFriends(res.data.map(f => f.receiver) || []);
      }
    } catch (error) {
      console.error('Failed to load friends', error);
    }
  };

  useEffect(() => {
    fetchGroupData();
    fetchFriends();
    setLoading(false);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id]);

  useEffect(() => {
    if (activeTab === 'balances') fetchBalances();
  }, [activeTab]);

  const handleAddMember = async (userId) => {
    try {
      await groupService.addMember(id, userId);
      toast.success('Member added!');
      setShowAddMember(false);
      fetchGroupData();
    } catch (error) {
      toast.error('Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Remove this member?')) {
      try {
        await groupService.removeMember(id, userId);
        toast.success('Member removed!');
        fetchGroupData();
      } catch (error) {
        toast.error('Failed to remove member');
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      const res = await groupService.deleteGroup(id);
      if (res && res.success) {
        toast.success('Group deleted');
        setShowConfirmDelete(false);
        navigate('/groups');
      } else {
        toast.error((res && res.message) || 'Failed to delete group');
      }
    } catch (error) {
      toast.error('Failed to delete group');
      console.error('Delete group error', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!group) return <div style={{ padding: '40px', textAlign: 'center' }}>Group not found</div>;

  

  return (
    <div>
      <ConfirmDeleteModal visible={showConfirmDelete} onCancel={() => setShowConfirmDelete(false)} onConfirm={handleConfirmDelete} deleting={deleting} isMobile={isMobile} />
      {/* Group Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '25px',
          padding: isMobile ? '30px' : '40px',
          color: '#fff',
          marginBottom: '40px'
        }}
      >
        {/* Top action row: Back and Remove */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '12px' : '18px', gap: '12px' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            style={{
              padding: isMobile ? '8px 12px' : '10px 16px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: isMobile ? '14px' : '15px'
            }}
          >
            ← Back
          </motion.button>

          <div style={{ marginLeft: 'auto' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowConfirmDelete(true)}
              style={{
                padding: isMobile ? '8px 12px' : '10px 16px',
                background: 'linear-gradient(90deg, rgba(220,38,38,0.95), rgba(185,28,28,0.95))',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: isMobile ? '14px' : '15px'
              }}
            >
              Remove Group
            </motion.button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px'
          }}>
            {group.name?.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '28px' : '36px', fontWeight: '700' }}>{group.name}</h1>
            <p style={{ margin: '0', opacity: 0.9 }}>{group.description || 'Group expense tracker'}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #eee',
        overflowX: isMobile ? 'auto' : 'visible',
      }}>
        {['expenses', 'members', 'balances'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '15px 25px',
              background: activeTab === tab ? '#667eea' : 'transparent',
              color: activeTab === tab ? '#fff' : '#666',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowAddExpense(!showAddExpense)}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <FiPlus /> Add Expense
          </motion.button>

          {showAddExpense && (
            <AddExpenseForm groupId={id} onSuccess={() => { setShowAddExpense(false); fetchGroupData(); }} />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {expenses && expenses.length > 0 ? (
              expenses.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: '#fff',
                    borderRadius: '15px',
                    padding: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{exp.title}</h4>
                      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                        Paid by <strong>{exp.user?.username}</strong>
                      </p>
                      <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
                        {new Date(exp.expenseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                        {formatCurrency(exp.amount)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                        {exp.splits?.length || 0} split
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                No expenses yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowAddMember(!showAddMember)}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <FiPlus /> Add Member
          </motion.button>

          {showAddMember && (
            <div style={{
              background: '#f9f9f9',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {friends
                  .filter(f => !members.some(m => m.userId === f.id))
                  .map(friend => (
                    <div key={friend.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fff', borderRadius: '10px' }}>
                      <span>{friend.fullName || friend.username}</span>
                      <button
                        onClick={() => handleAddMember(friend.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#667eea',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {members && members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: '#fff',
                  borderRadius: '15px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '24px',
                  margin: '0 auto 15px',
                  fontWeight: '700'
                }}>
                  {member.user?.username?.charAt(0).toUpperCase()}
                </div>
                <h4 style={{ margin: '0 0 5px 0' }}>{member.user?.fullName || member.user?.username}</h4>
                <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '12px' }}>
                  {member.user?.email}
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: 'rgba(102,126,234,0.1)',
                  color: '#667eea',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '15px'
                }}>
                  {member.role}
                </div>
                <button
                  onClick={() => handleRemoveMember(member.userId)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Balances & Settlements */}
      {activeTab === 'balances' && (
        <div>
          {/* Summary header */}
          <div style={{ background: 'linear-gradient(90deg, #6b46c1, #667eea)', borderRadius: '12px', padding: isMobile ? '18px' : '28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Outstanding</div>
              <div style={{ fontSize: isMobile ? '24px' : '34px', fontWeight: 800, marginTop: '6px' }}> {formatCurrency((() => {
                const me = balances.find(b => String(b.userId) === String(user?.id));
                const net = me ? Number(me.net) : 0;
                return Math.abs(net).toFixed(2);
              })())}</div>
            </div>

            <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Owed to You</div>
                <div style={{ color: '#10b981', fontWeight: 700 }}>{formatCurrency((() => { const me = balances.find(b => String(b.userId) === String(user?.id)); return me && Number(me.net) > 0 ? Math.abs(me.net).toFixed(2) : '0.00'; })())}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>You Owe</div>
                <div style={{ color: '#f59e0b', fontWeight: 700 }}>{formatCurrency((() => { const me = balances.find(b => String(b.userId) === String(user?.id)); return me && Number(me.net) < 0 ? Math.abs(me.net).toFixed(2) : '0.00'; })())}</div>
              </div>
            </div>
          </div>

          {/* Settlement suggestions list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {settlements && settlements.length > 0 ? settlements.map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{members.find(m => m.userId === s.from)?.user?.fullName || s.from}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>To: {members.find(m => m.userId === s.to)?.user?.fullName || s.to}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{formatCurrency(s.amount)}</div>
                  {String(user?.id) === String(s.from) ? (
                    <button onClick={async () => {
                      try {
                        const payerId = s.from;
                        const payeeId = s.to;
                        await groupService.settleGroupPayment(id, { payerId, payeeId, amount: s.amount });
                        toast.success('Settlement recorded');
                        fetchBalances();
                      } catch (err) {
                        toast.error('Failed to settle');
                        console.error(err);
                      }
                    }} style={{ padding: '10px 14px', background: '#10b981', color: '#fff', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Settle Now</button>
                  ) : (
                    <div style={{ padding: '8px 12px', borderRadius: 10, background: '#eef2ff', color: '#667eea' }}>Receive</div>
                  )}
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: '#999', padding: '30px' }}>No settlements suggested</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Confirmation Modal for Delete (rendered inside same file scope)
const ConfirmDeleteModal = ({ visible, onCancel, onConfirm, deleting, isMobile }) => {
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={onCancel} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: '12px', padding: isMobile ? '18px' : '24px', width: isMobile ? '92%' : '420px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
        <h3 style={{ margin: 0, marginBottom: '12px', color: '#111' }}>Delete Group</h3>
        <p style={{ margin: 0, marginBottom: '18px', color: '#444' }}>Are you sure you want to permanently delete this group? This action cannot be undone.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onCancel} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>{deleting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
};

// Add Expense Form Component
const AddExpenseForm = ({ groupId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    splits: []
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await groupService.getGroup(groupId);
        if (res.success) setMembers(res.data.members || []);
      } catch (error) {
        console.error('Failed to fetch members', error);
      }
    };
    fetchMembers();
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      toast.error('Fill all fields');
      return;
    }

    setLoading(true);
    try {
      const splits = members.map(m => ({
        userId: m.userId,
        amount: parseFloat((parseFloat(formData.amount) / members.length).toFixed(2)),
        sharePercentage: (100 / members.length)
      }));

      await groupService.createGroupExpense(groupId, { ...formData, amount: parseFloat(formData.amount), splits });
      toast.success('Expense added!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      style={{
        background: '#f9f9f9',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
        <input
          type="text"
          placeholder="Expense title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
        <input
          type="date"
          value={formData.expenseDate}
          onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
      </div>
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          background: '#667eea',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Adding...' : 'Add Expense'}
      </motion.button>
    </motion.form>
  );
};

export default GroupDetail;
