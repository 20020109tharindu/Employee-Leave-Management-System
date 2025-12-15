const LeaveTable = ({ leaves, isAdmin, onStatusChange }) => {
  const handleAction = async (id, status) => {
    try {
      await onStatusChange(id, status);
    } catch (err) {
      const msg = err.response?.data?.message || 'Action failed';
      alert(msg);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Start</th>
            <th>End</th>
            <th>Total Days</th>
            <th>Status</th>
            <th>Reason</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} className="text-center text-muted">No records</td>
            </tr>
          )}
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.employee?.name || 'Me'}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>{leave.totalDays}</td>
              <td>
                <span className={`badge bg-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'secondary'}`}>
                  {leave.status}
                </span>
              </td>
              <td style={{ maxWidth: '240px' }}>{leave.reason}</td>
              {isAdmin && (
                <td className="d-flex gap-1">
                  <button
                    className="btn btn-sm btn-success"
                    disabled={leave.status === 'Approved'}
                    onClick={() => handleAction(leave._id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    disabled={leave.status === 'Rejected'}
                    onClick={() => handleAction(leave._id, 'Rejected')}
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
