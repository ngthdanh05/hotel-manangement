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
  const [rows] = await db.query("SELECT * FROM Phong");
  return rows;
};

export const updateRoom = async (
  id: number,
  data: { SoPhong?: string; LoaiPhong?: string; Gia?: number },
) => {
  const fields = [];
  const values = [];

  if (data.SoPhong) {
    fields.push("SoPhong = ?");
    values.push(data.SoPhong);
  }
  if (data.LoaiPhong) {
    fields.push("LoaiPhong = ?");
    values.push(data.LoaiPhong);
  }
  if (data.Gia) {
    fields.push("Gia = ?");
    values.push(data.Gia);
  }

  values.push(id);

  await db.query(
    `UPDATE Phong SET ${fields.join(", ")} WHERE MaPhong = ?`,
    values,
  );
};

export const deleteRoom = async (id: number) => {
  await db.query("DELETE FROM Phong WHERE MaPhong = ?", [id]);
};
