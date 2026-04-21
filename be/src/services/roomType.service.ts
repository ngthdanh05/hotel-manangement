import { db } from "@/config/db";

export const createRoomType = async (data: {
  TenLoai: string;
  Gia: number;
  MoTa: string;
  SoNguoi: number;
}) => {
  const { TenLoai, Gia, MoTa, SoNguoi } = data;

  const [result]: any = await db.query(
    `INSERT INTO LoaiPhong (TenLoai, MoTa, Gia, SoNguoi)
     VALUES (?, ?, ?, ?)`,
    [TenLoai, MoTa, Gia, SoNguoi],
  );

  return result.insertId;
};

export const getAllRoomTypes = async () => {
  const [rows] = await db.query("SELECT * FROM LoaiPhong");
  return rows;
};

export const updateRoomType = async (id: number, data: any) => {
  const { TenLoai, MoTa, Gia, SoNguoi } = data;

  const [result]: any = await db.query(
    `UPDATE LoaiPhong 
     SET TenLoai = ?, MoTa = ?, Gia = ?, SoNguoi = ? 
     WHERE MaLoaiPhong = ?`,
    [TenLoai, MoTa, Gia, SoNguoi, id],
  );

  return result.affectedRows > 0;
};

export const deleteRoomType = async (id: number) => {
  const [result]: any = await db.query(
    `DELETE FROM LoaiPhong WHERE MaLoaiPhong = ?`,
    [id],
  );

  return result.affectedRows > 0;
};
