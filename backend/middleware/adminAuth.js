const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Admin session expired or invalid' });
  }
}

module.exports = { requireAdmin };