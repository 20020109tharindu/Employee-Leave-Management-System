import { useEffect, useState, useMemo } from 'react';
import api from '../api';
import LeaveTable from '../components/LeaveTable.jsx';
import ApplyLeaveForm from '../components/ApplyLeaveForm.jsx';

const Dashboard = ({ user, onLogout }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      const url = isAdmin ? '/leaves/all' : '/leaves/my-leaves';
      const res = await api.get(url);
      const all = res.data.leaves || [];
      // Per guidance, admins should see pending requests table
      const data = isAdmin ? all.filter(l => l.status === 'Pending') : all;
      setLeaves(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch leaves';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [isAdmin]);

  const handleApply = async (payload) => {
    try {
      await api.post('/leaves', payload);
      await fetchLeaves();
    } catch (err) {
      throw err;
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/status`, { status });
      await fetchLeaves();
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">Welcome, {user?.name}</h4>
          <small className="text-muted">Role: {user?.role}</small>
        </div>
        <button className="btn btn-outline-secondary" onClick={onLogout}>Logout</button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {!isAdmin && (
        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Apply for Leave</h5>
            <ApplyLeaveForm onSubmit={handleApply} />
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">{isAdmin ? 'Pending Leave Requests' : 'My Leave Requests'}</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={fetchLeaves} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <LeaveTable
            leaves={leaves}
            isAdmin={isAdmin}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
