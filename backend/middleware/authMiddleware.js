const jwt = require('jsonwebtoken');

// Customer check: reads the "userToken" cookie
const protectUser = (req, res, next) => {
    const token = req.cookies?.userToken;
    if (!token) return res.status(401).json({ message: 'Not authorized, please log in' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Session expired, please log in again' });
    }
};

// Admin check: reads the "token" cookie set by admin login
const protectAdmin = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Admin login required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Admin session expired, please log in again' });
    }
};

module.exports = { protectUser, protectAdmin };
