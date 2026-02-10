import { useState, useEffect } from 'react';
import { X, Mail, Shield, User } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, getCountFromServer } from 'firebase/firestore';

export function UserManagement({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({ admins: 0, users: 0 });
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
      fetchInvites();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    if (!db) return; // Demo mode guard
    try {
      const usersRef = collection(db, 'users');

      const adminQuery = query(usersRef, where('role', '==', 'admin'));
      const userQuery = query(usersRef, where('role', '==', 'user'));

      const [adminSnapshot, userSnapshot] = await Promise.all([
        getCountFromServer(adminQuery),
        getCountFromServer(userQuery)
      ]);

      setStats({
        admins: adminSnapshot.data().count,
        users: userSnapshot.data().count
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchInvites = async () => {
    if (!db) return; // Demo mode guard
    try {
        const invitesRef = collection(db, 'invites');
        const q = query(invitesRef); // In a real app, maybe filter by status
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInvites(data);
    } catch (err) {
        console.error("Error fetching invites:", err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!db) {
        setError("User management is not available in Demo Mode.");
        return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const invitesRef = collection(db, 'invites');
      const usersRef = collection(db, 'users');

      // 1. Check Limits (Active Users + Pending Invites) and existing users
      const pendingInvitesQuery = query(invitesRef, where('role', '==', role), where('status', '==', 'pending'));
      const emailQuery = query(invitesRef, where('email', '==', email));
      const userEmailQuery = query(usersRef, where('email', '==', email));

      const [pendingSnapshot, emailSnapshot, userEmailSnapshot] = await Promise.all([
        getCountFromServer(pendingInvitesQuery),
        getDocs(emailQuery),
        getDocs(userEmailQuery)
      ]);

      const pendingCount = pendingSnapshot.data().count;

      if (role === 'admin') {
         if (stats.admins + pendingCount >= 3) throw new Error('Maximum limit of 3 Admins reached (including pending invites).');
      } else {
         if (stats.users + pendingCount >= 5) throw new Error('Maximum limit of 5 Users reached (including pending invites).');
      }

      if (!emailSnapshot.empty) {
        throw new Error('This email has already been invited.');
      }

      if (!userEmailSnapshot.empty) {
        throw new Error('User with this email already exists.');
      }

      // Create Invite
      await addDoc(invitesRef, {
        email,
        role,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
      fetchInvites(); // Refresh list

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <span className="block text-xs text-blue-600 font-semibold uppercase">Admins</span>
                    <span className="block text-2xl font-bold text-blue-900">{stats.admins} / 3</span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                    <span className="block text-xs text-green-600 font-semibold uppercase">Users</span>
                    <span className="block text-2xl font-bold text-green-900">{stats.users} / 5</span>
                </div>
            </div>

            {/* Invite Form */}
            <div className="mb-6 border-b border-gray-200 pb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Invite New User</h4>
                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                placeholder="colleague@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                        >
                            <option value="user">User (View & Add)</option>
                            <option value="admin">Admin (Full Access)</option>
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                    >
                        {loading ? 'Sending Invite...' : 'Send Invite'}
                    </button>
                </form>
            </div>

            {/* Recent Invites List */}
            <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Invites</h4>
                <div className="bg-gray-50 rounded-md overflow-hidden max-h-40 overflow-y-auto">
                    {invites.length === 0 ? (
                        <p className="text-sm text-gray-500 p-4 text-center">No invites sent yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {invites.map(invite => (
                                <li key={invite.id} className="px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center">
                                        {invite.role === 'admin' ? <Shield className="h-4 w-4 text-blue-500 mr-2" /> : <User className="h-4 w-4 text-green-500 mr-2" />}
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{invite.email}</p>
                                            <p className="text-xs text-gray-500 capitalize">{invite.status}</p>
                                        </div>
                                    </div>
                                    {/* Could add delete invite button here */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
