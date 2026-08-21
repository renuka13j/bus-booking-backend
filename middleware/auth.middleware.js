const jwt = require('jsonwebtoken');

// This function runs BEFORE a protected route's actual controller.
// It checks: is there a valid token attached to this request?
function protect(req, res, next) {
  const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // grabs the part after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (id, role) to the request for later use
    next(); // token is valid, allow the request to continue to the actual controller
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { protect };