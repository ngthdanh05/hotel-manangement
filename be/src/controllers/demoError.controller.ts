import { db } from "@/config/db";
import { Request, Response } from "express";

export const demoLostUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query("CALL sp_DemoLostUpdate(?)", [id]);

    return res.json({
      message: "Update hoàn tất.",
    });
  } catch (error: any) {
    console.error("Lỗi tại Backend:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Lỗi thực thi demo" });
  }
};

export const triggerDirtyUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { giaMoi } = req.body;
  try {
    await db.query("CALL sp_DemoDirtyRead(?, ?)", [id, giaMoi]);
    return res.json({
      message: "Giả định giao dịch A đã kết thúc (đã Rollback).",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Đọc dữ liệu: Cố tình hạ Isolation Level để thấy lỗi Dirty Read
export const readPriceDirty = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // THIẾT LẬP MỨC CÔ LẬP THẤP NHẤT ĐỂ THẤY LỖI
    await db.query("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");

    const [rows]: any = await db.query(
      "SELECT Gia FROM LoaiPhong WHERE MaLoaiPhong = ?",
      [id],
    );

    return res.json({
      message: "Đọc giá phòng thành công",
      giaDocDuoc: rows[0].Gia,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const demoNonRepeatableRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows]: any = await db.query("CALL sp_DemoNonRepeatableRead(?)", [
      id,
    ]);

    const result = rows[0][0];

    return res.json({
      message: "Hoàn tất 2 lần đọc trong cùng một Transaction",
      lan_1: result.Gia_Ban_Dau,
      lan_2: result.Gia_Sau_Khi_Bi_Sua,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updatePriceInstant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { gia } = req.body;
  try {
    await db.query("UPDATE LoaiPhong SET Gia = ? WHERE MaLoaiPhong = ?", [
      gia,
      id,
    ]);
    return res.json({ message: "Update thành công!" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const demoPhantomRead = async (req: Request, res: Response) => {
  const { date } = req.query;
  try {
    console.log(`>>> [TX A] Đang đếm danh sách đặt phòng ngày: ${date}`);

    const [rows]: any = await db.query("CALL sp_DemoPhantomRead(?)", [date]);
    const result = rows[0][0];

    return res.json({
      message: "Kết quả kiểm tra Phantom Read",
      so_luong_truoc: result.So_Luong_Ban_Dau,
      so_luong_sau: result.So_Luong_Sau_Khi_Co_Ma,
      dong_bong_ma: result.So_Dong_Bong_Ma,
      canh_bao:
        result.So_Dong_Bong_Ma > 0
          ? "Phát hiện dòng bóng ma!"
          : "Dữ liệu ổn định",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const demoDeadlock = async (req: Request, res: Response) => {
  const { p1, p2, delay } = req.body;
  try {
    console.log(`>>> Bắt đầu TX: Lock ${p1} trước, sau đó Lock ${p2}`);

    await db.query("CALL sp_DeadlockDemo(?, ?, ?)", [p1, p2, delay]);

    return res.json({ message: "Giao dịch hoàn tất thành công!" });
  } catch (error: any) {
    console.error("Lỗi Deadlock:", error.message);
    // MySQL sẽ tự động phát hiện Deadlock và Kill 1 trong 2 TX
    if (error.code === "ER_LOCK_DEADLOCK") {
      return res.status(409).json({
        error: "DEADLOCK_DETECTED",
        message: "Hệ thống tự hủy giao dịch này để giải phóng bế tắc.",
      });
    }
    return res.status(500).json({ error: error.message });
  }
};
