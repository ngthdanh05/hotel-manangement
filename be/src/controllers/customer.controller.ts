import { Request, Response } from "express";
import * as customerService from "@/services/customer.service";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { HoTen, CCCD, SoDienThoai } = req.body;

    if (!HoTen || !CCCD || !SoDienThoai) {
      return res
        .status(400)
        .json({ message: "Please fill in all customer information." });
    }

    const maKH = await customerService.createCustomer({
      HoTen,
      CCCD,
      SoDienThoai,
    });

    return res.json({
      success: true,
      data: { MaKhachHang: maKH },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL ERROR SERVER" });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const data = await customerService.getAllCustomers();
    return res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL ERROR SERVER" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await customerService.deleteCustomer(Number(id));
    return res.json({
      success: true,
      message: "Delete customer successfully!",
    });
  } catch (error: any) {
    if (error.message === "CUSTOMER_HAS_BOOKINGS") {
      return res.status(400).json({
        message: "Không thể xóa khách hàng này vì họ đã có lịch sử đặt phòng.",
      });
    }
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
