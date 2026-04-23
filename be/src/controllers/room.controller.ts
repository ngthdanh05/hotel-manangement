import { Request, Response } from "express";
import * as roomService from "@/services/room.service";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { SoPhong, MaLoaiPhong } = req.body;

    if (!SoPhong || !MaLoaiPhong) {
      return res.status(400).json({ message: "Missing data" });
    }

    const id = await roomService.createRoom({
      SoPhong,
      MaLoaiPhong,
    });

    return res.json({
      success: true,
      data: { MaPhong: id },
    });
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW") {
      return res.status(400).json({
        message: "LoaiPhong không tồn tại",
      });
    }

    return res.status(500).json({ message: "INTERNAL ERROR SERVER" });
  }
};

export const getRooms = async (req: Request, res: Response) => {
  try {
    const { checkIn, checkOut } = req.query;

    // TRƯỜNG HỢP 1: KHÁCH CÓ TÌM KIẾM THEO NGÀY
    if (checkIn && checkOut) {
      const d1 = new Date(String(checkIn));
      const d2 = new Date(String(checkOut));

      // Validate: Ngày nhận phải trước ngày trả
      if (d1 >= d2) {
        return res.status(400).json({
          success: false,
          message: "Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày",
        });
      }

      // Validate: Không được đặt ngày trong quá khứ
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d1 < today) {
        return res.status(400).json({
          success: false,
          message: "Không thể tìm phòng cho những ngày đã qua",
        });
      }

      const rooms = await roomService.getAvailableRooms(
        String(checkIn),
        String(checkOut),
      );

      return res.json({
        success: true,
        isSearch: true,
        data: rooms,
      });
    }

    // TRƯỜNG HỢP 2: KHÁCH XEM MẶC ĐỊNH (KHÔNG TÌM KIẾM)
    const allRooms = await roomService.getAllRoomTypes();
    return res.json({
      success: true,
      isSearch: false,
      data: allRooms,
    });
  } catch (error) {
    console.error("Room Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi truy xuất dữ liệu phòng",
    });
  }
};
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await roomService.updateRoom(Number(id), req.body);

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL ERROR SERVER" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await roomService.deleteRoom(Number(id));

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL ERROR SERVER" });
  }
};
