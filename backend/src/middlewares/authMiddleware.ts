import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware for cookie-based authentication
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Retrieve the token from cookies
    const token = req.cookies?.authToken;

    if (!token) {
      res.status(401).json({ isError: true, message: "Unauthorized: No token provided" });
      return;
    }

    const secretKey = process.env.SECRET_KEY || "your_secret_key"; // Replace with your secret key
    const decoded = jwt.verify(token, secretKey);

    // Attach user information to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ isError: true, message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
