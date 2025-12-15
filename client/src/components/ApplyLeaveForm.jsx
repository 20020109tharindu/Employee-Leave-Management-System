import { useState } from 'react';

const ApplyLeaveForm = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ startDate, endDate, reason });
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply for leave';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      {error && <div className="col-12"><div className="alert alert-danger py-2">{error}</div></div>}
      <div className="col-md-4">
        <label className="form-label">Start Date</label>
        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">End Date</label>
        <input
          type="date"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Reason</label>
        <input
          type="text"
          className="form-control"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          maxLength={200}
        />
      </div>
      <div className="col-12 d-flex justify-content-end">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default ApplyLeaveForm;
