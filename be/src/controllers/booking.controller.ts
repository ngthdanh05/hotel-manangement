import { Request, Response } from "express";
import * as bookingService from "@/services/booking.service";
import { db } from "@/config/db";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { HoTen, CCCD, SoDienThoai, MaPhong, NgayNhan, NgayTra } = req.body;

    if (!HoTen || !CCCD || !MaPhong || !NgayNhan || !NgayTra) {
      return res.status(400).json({ message: "INFORMATION INVALID" });
    }

    const result = await bookingService.createBooking({
      HoTen,
      CCCD,
      SoDienThoai,
      MaPhong,
      NgayNhan,
      NgayTra,
    });

    return res.json({
      success: true,
      message: "Booking successfully!",
      data: result,
    });
  } catch (error: any) {
    console.error(error);

    if (error.message.includes("PHONG_DA_DUOC_DAT")) {
      return res.status(400).json({ error: "ROOM_ALREADY_BOOKED" });
    }

    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const data = await bookingService.getAllBookings();
    return res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [booking]: any = await db.query(
      "SELECT TrangThai FROM DatPhong WHERE MaDatPhong = ?",
      [id],
    );
    if (booking[0].TrangThai !== "da_dat") {
      return res.status(400).json({
        message: "Reservations can only be modified before check-in.",
      });
    }

    await bookingService.updateBooking(Number(id), updateData);

    return res.json({
      success: true,
      message: "Update successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const handleCheckIn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await bookingService.checkIn(Number(id));
    return res.json({ success: true, message: "CheckIn successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [status]: any = await db.query(
      "SELECT TrangThai FROM DatPhong WHERE MaDatPhong = ?",
      [id],
    );

    if (status.length > 0 && status[0].TrangThai === "dang_o") {
      return res
        .status(400)
        .json({ message: "Không thể xóa đơn đặt phòng khi khách đang ở." });
    }

    await bookingService.deleteBooking(Number(id));
    return res.json({ success: true, message: "Delete booking successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const handleCheckOut = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await bookingService.checkOut(Number(id));

    return res.json({
      success: true,
      message: "CheckOut successfully!",
      invoice: invoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
