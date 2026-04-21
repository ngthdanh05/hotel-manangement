import { db } from "@/config/db";

export const createCustomer = async (data: {
  HoTen: string;
  CCCD: string;
  SoDienThoai: string;
}) => {
  const { HoTen, CCCD, SoDienThoai } = data;

  const [existing]: any = await db.query(
    "SELECT MaKhachHang FROM KhachHang WHERE CCCD = ?",
    [CCCD],
  );

  if (existing.length > 0) {
    return existing[0].MaKhachHang;
  }

  const [result]: any = await db.query(
    "INSERT INTO KhachHang (HoTen, CCCD, SoDienThoai) VALUES (?, ?, ?)",
    [HoTen, CCCD, SoDienThoai],
  );

  return result.insertId;
};

export const deleteCustomer = async (id: number) => {
  const [bookings]: any = await db.query(
    "SELECT COUNT(*) as count FROM DatPhong WHERE MaKhachHang = ?",
    [id],
  );

  if (bookings[0].count > 0) {
    throw new Error("CUSTOMER_HAS_BOOKINGS");
  }

  const [result]: any = await db.query(
    "DELETE FROM KhachHang WHERE MaKhachHang = ?",
    [id],
  );
  return result.affectedRows > 0;
};

export const findCustomerByCCCD = async (cccd: string) => {
  const [rows]: any = await db.query("SELECT * FROM KhachHang WHERE CCCD = ?", [
    cccd,
  ]);
  return rows[0];
};

export const getAllCustomers = async () => {
  const [rows] = await db.query(
    "SELECT * FROM KhachHang ORDER BY MaKhachHang DESC",
  );
  return rows;
};
