import { Request, Response } from "express";
import * as service from "@/services/roomType.service";

export const createRoomType = async (req: Request, res: Response) => {
  try {
    const { TenLoai, Gia, MoTa, SoNguoi } = req.body;

    if (!TenLoai || !Gia || !SoNguoi) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const id = await service.createRoomType({ TenLoai, Gia, MoTa, SoNguoi });

    return res.json({
      success: true,
      data: { MaLoaiPhong: id },
    });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL ERROR SERVER" });
  }
};

export const getRoomTypes = async (req: Request, res: Response) => {
  const data = await service.getAllRoomTypes();
  res.json({ success: true, data });
};

export const updateRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { TenLoai, Gia, MoTa, SoNguoi } = req.body;

    if (!id || !TenLoai || !Gia || !SoNguoi) {
      return res.status(400).json({ message: "Missing fields or ID" });
    }

    const isUpdated = await service.updateRoomType(Number(id), {
      TenLoai,
      Gia,
      MoTa,
      SoNguoi,
    });

    if (!isUpdated) {
      return res
        .status(404)
        .json({ message: "Room type not found or no changes made" });
    }

    return res.json({
      success: true,
      message: "Update room type successfully",
    });
  } catch (error) {
    console.error("Update Room Type Error:", error);
    return res.status(500).json({ message: "INTERNAL ERROR SERVER" });
  }
};

export const deleteRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing ID" });
    }

    const isDeleted = await service.deleteRoomType(Number(id));

    if (!isDeleted) {
      return res.status(404).json({ message: "Room type not found" });
    }

    return res.json({
      success: true,
      message: "Delete room type successfully",
    });
  } catch (error) {
    console.error("Delete Room Type Error:", error);
    return res.status(500).json({ message: "INTERNAL ERROR SERVER" });
  }
};
