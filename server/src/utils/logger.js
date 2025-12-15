// Simple audit logger utility
const logAudit = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[AUDIT LOG] ${timestamp} - ${message}`);
  
  // In production, you could write this to a file or database
  // For now, we'll just log to console
};

module.exports = { logAudit };
