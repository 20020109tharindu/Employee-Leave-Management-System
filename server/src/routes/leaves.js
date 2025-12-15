const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Leave = require('../models/Leave');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const { logAudit } = require('../utils/logger');

// Helper function to calculate total days
const calculateTotalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
  return diffDays;
};

// POST /leaves - (Employee only) Create a leave request
router.post('/', [
  auth,
  checkRole('employee'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('reason').notEmpty().trim().withMessage('Reason is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { startDate, endDate, reason } = req.body;

    // Validate that end date is not before start date
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    // Calculate total days
    const totalDays = calculateTotalDays(startDate, endDate);

    // Create leave request
    const leave = new Leave({
      employee: req.user._id,
      startDate,
      endDate,
      reason,
      totalDays,
      status: 'Pending'
    });

    await leave.save();

    res.status(201).json({
      message: 'Leave request created successfully',
      leave
    });
  } catch (error) {
    console.error('Create leave error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /leaves/my-leaves - (Employee only) Get their own leave history
router.get('/my-leaves', [auth, checkRole('employee')], async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id })
      .sort({ createdAt: -1 })
      .populate('employee', 'name email');

    res.json({
      message: 'Leave history retrieved successfully',
      count: leaves.length,
      leaves
    });
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /leaves/all - (Admin only) Get all leave requests
router.get('/all', [auth, checkRole('admin')], async (req, res) => {
  try {
    const leaves = await Leave.find()
      .sort({ createdAt: -1 })
      .populate('employee', 'name email');

    res.json({
      message: 'All leave requests retrieved successfully',
      count: leaves.length,
      leaves
    });
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /leaves/:id/status - (Admin only) Update status to "Approved" or "Rejected"
router.put('/:id/status', [
  auth,
  checkRole('admin'),
  param('id').isMongoId().withMessage('Invalid leave ID'),
  body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be either Approved or Rejected')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Find the leave request
    const leave = await Leave.findById(id).populate('employee', 'name email');
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update status
    leave.status = status;

    // Add audit log
    const auditEntry = {
      action: `Admin ${req.user.name} ${status.toLowerCase()} leave request`,
      admin: req.user._id,
      at: new Date()
    };
    leave.audit.push(auditEntry);

    await leave.save();

    // Log audit to console/file
    logAudit(`Admin ${req.user.name} (${req.user.email}) ${status.toLowerCase()} leave request #${leave._id} for ${leave.employee.name} at ${new Date().toISOString()}`);

    res.json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leave
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
