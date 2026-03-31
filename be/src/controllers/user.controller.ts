import { db } from "config/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "ACCOUNT_INVALID" });

    const [exists]: any = await db.query(
      "select * form Users where email = ?",
      [email],
    );

    if (exists.length > 0) {
      return res.status(400).json({ error: "ACCOUNT_ALREADY_EXISTS" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await db.query(
      `insert into Users (name, email, password_hash, role) values (?, ? ,? , ?)`,
      [name, email, password_hash, "user"],
    );

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "ACCOUNT_INVALID" });

    const [rows]: any = await db.query("select * from Users where email = ?", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(400).json({ error: "ACCOUNT_NOT_FOUND" });
    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return res.status(401).json({ error: "WRONG_PASSWORD" });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.cookie("session_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("session_token", { path: "/" });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
