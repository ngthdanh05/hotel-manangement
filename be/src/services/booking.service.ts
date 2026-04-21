import { db } from "@/config/db";
import * as customerService from "./customer.service";

export const createBooking = async (bookingData: {
  HoTen: string;
  CCCD: string;
  SoDienThoai: string;
  MaPhong: number;
  NgayNhan: string;
  NgayTra: string;
}) => {
  const { HoTen, CCCD, SoDienThoai, MaPhong, NgayNhan, NgayTra } = bookingData;

  const maKH = await customerService.createCustomer({
    HoTen,
    CCCD,
    SoDienThoai,
  });

  try {
    await db.query("CALL sp_DatPhong(?, ?, ?, ?)", [
      maKH,
      NgayNhan,
      NgayTra,
      MaPhong,
    ]);

    return { success: true, maKH };
  } catch (error: any) {
    throw new Error(error.sqlMessage || "Lỗi khi thực hiện đặt phòng");
  }
};

export const updateBooking = async (
  maDatPhong: number,
  data: {
    HoTen?: string;
    SoDienThoai?: string;
    NgayNhanPhong?: string;
    NgayTraPhong?: string;
    MaPhong?: number;
  },
) => {
  const { HoTen, SoDienThoai, NgayNhanPhong, NgayTraPhong, MaPhong } = data;

  // bắt đầu Transaction
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // thay đổi thông tin khách hàng
    if (HoTen || SoDienThoai) {
      const [booking]: any = await connection.query(
        "SELECT MaKhachHang FROM DatPhong WHERE MaDatPhong = ?",
        [maDatPhong],
      );

      if (booking.length > 0) {
        const fields = [];
        const values = [];
        if (HoTen) {
          fields.push("HoTen = ?");
          values.push(HoTen);
        }
        if (SoDienThoai) {
          fields.push("SoDienThoai = ?");
          values.push(SoDienThoai);
        }
        values.push(booking[0].MaKhachHang);

        await connection.query(
          `UPDATE KhachHang SET ${fields.join(", ")} WHERE MaKhachHang = ?`,
          values,
        );
      }
    }

    // thay đổi thông tin đặt phòng
    if (NgayNhanPhong || NgayTraPhong || MaPhong) {
      const [current]: any = await connection.query(
        "SELECT NgayNhanPhong, NgayTraPhong, MaPhong FROM v_Booking WHERE MaDatPhong = ?",
        [maDatPhong],
      );

      const checkIn = NgayNhanPhong || current[0].NgayNhanPhong;
      const checkOut = NgayTraPhong || current[0].NgayTraPhong;
      const roomID = MaPhong || current[0].MaPhong;

      const [isAvailable]: any = await connection.query(
        "SELECT KiemTraPhongTrongUpdate(?, ?, ?, ?) as available",
        [roomID, checkIn, checkOut, maDatPhong],
      );

      if (!isAvailable[0].available) {
        throw new Error("PHONG_KHONG_KHA_DUNG");
      }

      await connection.query(
        "UPDATE DatPhong SET NgayNhanPhong = ?, NgayTraPhong = ? WHERE MaDatPhong = ?",
        [checkIn, checkOut, maDatPhong],
      );

      if (MaPhong) {
        await connection.query(
          "UPDATE ChiTietDatPhong SET MaPhong = ? WHERE MaDatPhong = ?",
          [MaPhong, maDatPhong],
        );
      }
    }

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getAllBookings = async () => {
  const [rows] = await db.query(
    "SELECT * FROM v_Booking ORDER BY MaDatPhong DESC",
  );
  return rows;
};

export const checkIn = async (maDatPhong: number) => {
  await db.query("CALL sp_NhanPhong(?)", [maDatPhong]);
  return { success: true };
};

export const checkOut = async (maDatPhong: number) => {
  const [result]: any = await db.query("CALL sp_TraPhongThanhToan(?)", [
    maDatPhong,
  ]);

  return result[0][0];
};

export const deleteBooking = async (maDatPhong: number) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    await connection.query("DELETE FROM ChiTietDatPhong WHERE MaDatPhong = ?", [
      maDatPhong,
    ]);

    const [result]: any = await connection.query(
      "DELETE FROM DatPhong WHERE MaDatPhong = ?",
      [maDatPhong],
    );

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
