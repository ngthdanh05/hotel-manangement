import { db } from "@/config/db";
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const yearParam = req.query.year;
    const year =
      typeof yearParam === "string" && !isNaN(Number(yearParam))
        ? Number(yearParam)
        : new Date().getFullYear();

    const [
      [roomsResult],
      [customersResult],
      [ordersResult],
      [revenueResult],
      [monthlyRevenueRaw],
    ] = await Promise.all([
      db.query<RowDataPacket[]>(
        "SELECT COUNT(MaPhong) as totalRooms FROM Phong",
      ),
      db.query<RowDataPacket[]>(
        "SELECT COUNT(MaKhachHang) as totalCustomers FROM KhachHang",
      ),
      db.query<RowDataPacket[]>(
        "SELECT COUNT(MaDatPhong) as totalOrders FROM DatPhong",
      ),
      db.query<RowDataPacket[]>(
        "SELECT SUM(TongTien) as totalRevenue FROM HoaDon",
      ),
      db.query<RowDataPacket[]>(
        `
       SELECT 
    MONTH(NgayThanhToan) as month, 
    SUM(TongTien) as revenue, 
    COUNT(MaHoaDon) as transactions
  FROM HoaDon
  WHERE YEAR(NgayThanhToan) = ?
  GROUP BY MONTH(NgayThanhToan)
  ORDER BY month ASC
        `,
        [year],
      ),
    ]);

    const totalRooms = Number(roomsResult[0]?.totalRooms) || 0;
    const totalCustomers = Number(customersResult[0]?.totalCustomers) || 0;
    const totalOrders = Number(ordersResult[0]?.totalOrders) || 0;
    const totalRevenue = Number(revenueResult[0]?.totalRevenue) || 0;

    const revenueMap = new Map<number, RowDataPacket>();
    monthlyRevenueRaw.forEach((item) => {
      revenueMap.set(item.month, item);
    });

    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const record = revenueMap.get(i + 1);
      return {
        month: `T${i + 1}`,
        revenue: record ? Number(record.revenue) : 0,
        transactions: record ? Number(record.transactions) : 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalRooms,
        totalCustomers,
        totalOrders,
        totalRevenue,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu Dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const [bookings] = await db.query<RowDataPacket[]>(
      "SELECT * FROM v_Booking ORDER BY NgayNhanPhong DESC",
    );

    return res.json({
      message: "Lấy danh sách đặt phòng thành công",
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};

export const updateBookings = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const connection = await db.getConnection();
  try {
    switch (status) {
      case "dang_o":
        await db.query("CALL sp_NhanPhong(?)", [id]);
        break;

      case "da_tra":
        // 1. Thanh toán
        await db.query("CALL sp_TraPhongThanhToan(?)", [id]);

        // 2. Lấy hóa đơn
        const [invoiceDetails]: any = await db.query(
          `SELECT h.*, k.HoTen, p.SoPhong, lp.TenLoai, 
                  DATEDIFF(dp.NgayTraPhong, dp.NgayNhanPhong) as SoNgay
           FROM HoaDon h
           JOIN DatPhong dp ON h.MaDatPhong = dp.MaDatPhong
           JOIN KhachHang k ON dp.MaKhachHang = k.MaKhachHang
           JOIN ChiTietDatPhong ct ON dp.MaDatPhong = ct.MaDatPhong
           JOIN Phong p ON ct.MaPhong = p.MaPhong
           JOIN LoaiPhong lp ON p.MaLoaiPhong = lp.MaLoaiPhong
           WHERE h.MaDatPhong = ?`,
          [id],
        );

        invoiceDetails[0];
        break;

      case "da_huy":
        await connection.beginTransaction();
        await connection.query(
          "UPDATE DatPhong SET TrangThai = 'da_huy' WHERE MaDatPhong = ?",
          [id],
        );
        await connection.query(
          `
            UPDATE Phong p 
            JOIN ChiTietDatPhong ct ON p.MaPhong = ct.MaPhong 
            SET p.TrangThai = 'trong' 
            WHERE ct.MaDatPhong = ?
          `,
          [id],
        );
        await connection.commit();
        break;

      case "da_dat":
        await db.query(
          "UPDATE DatPhong SET TrangThai = 'da_dat' WHERE MaDatPhong = ?",
          [id],
        );
        break;

      default:
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    return res.json({
      message: `Cập nhật trạng thái sang ${status} thành công`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};
