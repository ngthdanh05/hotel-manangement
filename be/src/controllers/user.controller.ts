import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "@/middleware/auth";
import { db } from "@/config/db";

export const registerUser = async (req: Request, res: Response) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { name, email, password, phone } = req.body;

    const [exists]: any = await connection.query(
      "select * from Users where email = ?",
      [email],
    );
    if (exists.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: "ACCOUNT_ALREADY_EXISTS" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [userResult]: any = await connection.query(
      `insert into Users (name, email, password_hash, role) values (?, ?, ?, 'customer')`,
      [name, email, password_hash],
    );

    const userId = userResult.insertId;

    await connection.query(
      `insert into KhachHang (HoTen, SoDienThoai, id_user) values (?, ?, ?)`,
      [name, phone, userId],
    );

    await connection.commit();
    return res.json({ success: true, message: "Đăng ký thành công" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  } finally {
    connection.release();
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

export const profile = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await db.query(
      `select id, name, email, created_at 
        from Users
       where email = ? 
       limit 1`,
      [req.user?.email],
    );

    const user = rows[0];

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "USER_NOT_FOUND" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "INTERNAL_SERVER_ERROR" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [users]: [any, any] = await db.query(
      `SELECT id, name, email, role, created_at 
       FROM Users 
       ORDER BY created_at DESC`,
    );

    return res.json({
      success: true,
      total: users.length,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: [any, any] = await db.query(
      `SELECT id FROM Users WHERE id = ?`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    await db.query(`DELETE FROM Users WHERE id = ?`, [id]);

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
