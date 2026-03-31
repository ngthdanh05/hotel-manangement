import { Request, Response } from "express";
import { db } from "../config/db";

export const getAvailableRooms = async (req: Request, res: Response) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing date" });
    }

    const [rows]: any = await db.query("call TimPhongTrong(?, ?)", [
      checkIn,
      checkOut,
    ]);

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};
