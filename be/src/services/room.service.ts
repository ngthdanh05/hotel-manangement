import { db } from "@/config/db";

export const createRoom = async (data: {
  SoPhong: string;
  MaLoaiPhong: number;
}) => {
  const { SoPhong, MaLoaiPhong } = data;

  const [result]: any = await db.query(
    `INSERT INTO Phong (SoPhong, MaLoaiPhong)
     VALUES (?, ?)`,
    [SoPhong, MaLoaiPhong],
  );

  return result.insertId;
};

export const getAllRooms = async () => {
  const [rows] = await db.query(`
    SELECT p.MaPhong, p.SoPhong, lp.TenLoai, lp.Gia, lp.SoNguoi
    FROM Phong p
    JOIN LoaiPhong lp ON p.MaLoaiPhong = lp.MaLoaiPhong
  `);
  return rows;
};

export const updateRoom = async (
  id: number,
  data: { SoPhong?: string; MaLoaiPhong?: number },
) => {
  const fields = [];
  const values = [];

  if (data.SoPhong) {
    fields.push("SoPhong = ?");
    values.push(data.SoPhong);
  }
  if (data.MaLoaiPhong) {
    fields.push("MaLoaiPhong = ?");
    values.push(data.MaLoaiPhong);
  }

  if (fields.length === 0) return false;

  values.push(id);

  const [result]: any = await db.query(
    `UPDATE Phong SET ${fields.join(", ")} WHERE MaPhong = ?`,
    values,
  );
  return result.affectedRows > 0;
};

export const deleteRoom = async (id: number) => {
  const [result]: any = await db.query("DELETE FROM Phong WHERE MaPhong = ?", [
    id,
  ]);
  return result.affectedRows > 0;
};
