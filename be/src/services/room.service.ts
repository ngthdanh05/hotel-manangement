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

export const getAllRoomTypes = async () => {
  const [rows] = await db.query("SELECT * FROM v_GiaoDienKhachHang");
  return rows;
};

export const getAvailableRooms = async (checkIn: string, checkOut: string) => {
  const [rows]: any = await db.query("CALL sp_TimPhongTrong(?, ?)", [
    checkIn,
    checkOut,
  ]);

  const rawRooms = rows[0] || [];

  const groupedRooms = rawRooms.reduce((acc: any, room: any) => {
    const key = room.MaLoaiPhong;

    if (!acc[key]) {
      acc[key] = {
        MaLoaiPhong: room.MaLoaiPhong,
        TenLoai: room.TenLoai,
        Gia: room.Gia,
        MoTa: room.MoTa,
        SoNguoi: room.SoNguoi,
        SoPhongTrong: 0,
        ConPhong: 1,
      };
    }

    acc[key].SoPhongTrong += 1;

    return acc;
  }, {});

  return Object.values(groupedRooms);
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
