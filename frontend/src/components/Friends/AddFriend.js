import React, { useEffect, useState, useCallback } from 'react';
import { friendService } from '../../services/friends';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

const AddFriend = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sendingIds, setSendingIds] = useState(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await friendService.getAllUsers();
      const list = Array.isArray(res) ? res : (res?.data ?? res);
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load users', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadUsers]);

  const handleAdd = async (userId) => {
    if (sendingIds.has(userId)) return;
    // Optimistic update: mark as friend immediately in UI
    setSendingIds(prev => new Set(prev).add(userId));
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, friendshipStatus: 'friend' } : u));
    // notify other components (e.g., Friends list) to refresh
    try {
      window.dispatchEvent(new CustomEvent('friends-updated', { detail: { userId } }));
    } catch (e) {
      // ignore if running in non-browser env
    }

    try {
      const res = await friendService.sendFriendRequest(userId);
      const ok = res?.success ?? true;

      if (!ok) {
        const msg = res?.message || 'Failed to add friend';
        // Treat already-sent/already-friends as success (keep optimistic state)
        if (/already sent/i.test(msg) || /already friend/i.test(msg) || /already friends/i.test(msg)) {
          return;
        }
        // revert optimistic update on other failures
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, friendshipStatus: 'none' } : u));
        toast.error(msg);
      }
    } catch (err) {
      console.error('Add friend error', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to add friend';
      // If backend indicates request already exists, keep optimistic state
      if (/already sent/i.test(msg) || /already friend/i.test(msg) || /already friends/i.test(msg)) {
        return;
      }
      // revert optimistic update for unexpected errors
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, friendshipStatus: 'none' } : u));
      toast.error(msg);
    } finally {
      setSendingIds(prev => {
        const copy = new Set(prev);
        copy.delete(userId);
        return copy;
      });
    }
  };

  const filtered = users.filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (u.fullName || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q);
  });

  const tableHeaderStyle = {
    display: isMobile ? 'none' : 'table-header-group',
  };

  const tableBodyStyle = {
    display: isMobile ? 'flex' : 'table-row-group',
    flexDirection: isMobile ? 'column' : 'none',
    gap: isMobile ? '16px' : '0',
  };

  const tableRowStyle = {
    display: isMobile ? 'flex' : 'table-row',
    flexDirection: isMobile ? 'column' : 'none',
    background: isMobile ? '#fff' : 'transparent',
    borderRadius: isMobile ? '12px' : '0',
    padding: isMobile ? '16px' : '0',
    boxShadow: isMobile ? '0 4px 15px rgba(0,0,0,0.07)' : 'none',
    borderBottom: isMobile ? 'none' : '1px solid #f1f5f9',
  };

  const tableCellStyle = {
    padding: isMobile ? '8px 0' : '12px 8px',
    display: isMobile ? 'flex' : 'table-cell',
    justifyContent: isMobile ? 'space-between' : 'flex-start',
    alignItems: isMobile ? 'center' : 'center',
    borderBottom: isMobile ? '1px solid #f1f5f9' : 'none',
  };

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Add Friend</h2>
        <p style={{ margin: 0, color: '#666' }}>Browse all registered users and add them as friends.</p>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, username or email"
            style={{ width: '100%', padding: '12px 14px 12px 44px', borderRadius: 10, border: '1px solid #e5e7eb' }}
          />
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa4c7' }}>
            <FiSearch />
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={tableHeaderStyle}>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eef2f7' }}>
              <th style={{ padding: '12px 8px' }}>User</th>
              <th style={{ padding: '12px 8px' }}>Username</th>
              <th style={{ padding: '12px 8px' }}>Email</th>
              <th style={{ padding: '12px 8px', width: 140 }}>Status</th>
              <th style={{ padding: '12px 8px', width: 140 }}>Action</th>
            </tr>
          </thead>

          <tbody style={tableBodyStyle}>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#666' }}>Loading users...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#666' }}>No users found</td>
              </tr>
            ) : (
              filtered.map(user => (
                <tr key={user.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: user.avatarColor || '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                      {(user.username || '').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.fullName || user.username}</div>
                    </div>
                  </td>

                  <td style={tableCellStyle}>
                    {isMobile && <span style={{ fontWeight: 600, color: '#333' }}>Username</span>}
                    <span style={{ color: '#666' }}>@{user.username}</span>
                  </td>
                  <td style={tableCellStyle}>
                    {isMobile && <span style={{ fontWeight: 600, color: '#333' }}>Email</span>}
                    <span style={{ color: '#666' }}>{user.email}</span>
                  </td>

                  <td style={tableCellStyle}>
                    {isMobile && <span style={{ fontWeight: 600, color: '#333' }}>Status</span>}
                    <div>
                      {user.friendshipStatus === 'friend' ? (
                        <span style={{ padding: '6px 10px', background: 'rgba(16,185,129,0.12)', color: '#059669', borderRadius: 8, fontWeight: 600 }}>Friends</span>
                      ) : (
                        <span style={{ padding: '6px 10px', background: '#f3f4f6', color: '#6b7280', borderRadius: 8, fontWeight: 600 }}>Not friends</span>
                      )}
                    </div>
                  </td>

                  <td style={tableCellStyle}>
                    {isMobile && <span style={{ fontWeight: 600, color: '#333' }}>Action</span>}
                    <div>
                      {user.friendshipStatus === 'friend' ? (
                        <button disabled style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#e6eef8', color: '#4b5563', fontWeight: 600 }}>Added</button>
                      ) : (
                        <button
                          onClick={() => handleAdd(user.id)}
                          disabled={sendingIds.has(user.id)}
                          style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                        >
                          {sendingIds.has(user.id) ? 'Adding...' : 'Add'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddFriend;
