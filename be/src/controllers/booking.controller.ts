import { Request, Response } from "express";
import * as bookingService from "@/services/booking.service";
import { db } from "@/config/db";
import { AuthRequest } from "@/middleware/auth";

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

export const finalizeBooking = async (req: AuthRequest, res: Response) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { cccd, maLoaiPhong, ngayNhan, ngayTra } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Bạn chưa đăng nhập" });

    const [customers]: any = await connection.query(
      "SELECT MaKhachHang FROM KhachHang WHERE id_user = ?",
      [userId],
    );

    if (customers.length === 0)
      throw new Error("Không tìm thấy thông tin khách hàng");
    const maKH = customers[0].MaKhachHang;

    await connection.query(
      "UPDATE KhachHang SET CCCD = ? WHERE MaKhachHang = ?",
      [cccd, maKH],
    );

    const [availableRooms]: any = await connection.query(
      `SELECT p.MaPhong 
   FROM Phong p
   WHERE p.MaLoaiPhong = ? 
   AND p.MaPhong NOT IN (
     SELECT ct.MaPhong 
     FROM ChiTietDatPhong ct
     JOIN DatPhong dp ON ct.MaDatPhong = dp.MaDatPhong
     WHERE NOT (dp.NgayTraPhong <= ? OR dp.NgayNhanPhong >= ?)
   ) 
   LIMIT 1`,
      [maLoaiPhong, ngayNhan, ngayTra],
    );

    if (availableRooms.length === 0) {
      return res.status(400).json({
        message: "Loại phòng này đã hết phòng trống trong khoảng thời gian này",
      });
    }
    const maPhongThucTe = availableRooms[0].MaPhong;

    await connection.query("CALL sp_DatPhong(?, ?, ?, ?)", [
      maKH,
      maPhongThucTe,
      ngayNhan,
      ngayTra,
    ]);

    await connection.commit();
    return res.json({ success: true, message: "Đặt phòng thành công!" });
  } catch (error: any) {
    await connection.rollback();
    console.error("Lỗi Controller:", error);
    return res
      .status(400)
      .json({ message: error.message || "Lỗi hệ thống khi đặt phòng" });
  } finally {
    connection.release();
  }
};

export const getHistoryBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Bạn cần đăng nhập để xem lịch sử" });
    }

    const [rows]: any = await db.query(
      "SELECT * FROM v_Booking WHERE id_user = ? ORDER BY MaDatPhong DESC",
      [userId],
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
