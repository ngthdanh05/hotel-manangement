import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: "user" | "admin";
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.session_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      role: "user" | "admin";
    };

    req.user = decoded;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "TOKEN_EXPIRED" });
    }

    return res.status(403).json({ error: "INVALID_TOKEN" });
  }
};
