import { db } from "@/config/db";
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
    const rooms = await roomService.getAllRooms();

    return res.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL ERROR SERVER" });
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

export const getAvailableRooms = async (req: Request, res: Response) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing date" });
    }

    const [rows]: any = await db.query("call TimPhongTrong(?, ?)", [
      checkIn,
      checkOut,
    ]);

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
