import { Response } from "express";
import { db } from "../config/db";
import { AuthRequest } from "middleware/auth";

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { MaPhong, checkIn, checkOut } = req.body;

    const userId = req.user?.id;

    if (!MaPhong || !checkIn || !checkOut) {
      return res.status(400).json({ error: "INVALID_DATA" });
    }

    await db.query("call DatPhongSafe(?, ?, ?, ?)", [
      userId,
      MaPhong,
      checkIn,
      checkOut,
    ]);

    res.json({ success: true, message: "Đặt phòng thành công" });
  } catch (error: any) {
    console.error(error);

    if (error.message.includes("PHONG_DA_DUOC_DAT")) {
      return res.status(400).json({ error: "ROOM_ALREADY_BOOKED" });
    }

    res.status(500).json({ error: "SERVER_ERROR" });
  }
};

export const getHistoryBookings = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      select dp.*, p.SoPhong, p.LoaiPhong
      from DatPhong dp
      join ChiTietDatPhong ct on dp.MaDatPhong = ct.MaDatPhong
      join Phong p ON ct.MaPhong = p.MaPhong
      where dp.MaKH = ?
      order by dp.MaDatPhong desc
      `,
      [userId],
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};
