import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};  

export const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]; // "2025-07-26T18:30:00.000Z"
};