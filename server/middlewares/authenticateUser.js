import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; // 👈 Read JWT from cookie

  if (!token) {
    return res.status(401).json({ error: true, message: 'Unauthorized: No token found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store { id: user._id }
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
  }
};

