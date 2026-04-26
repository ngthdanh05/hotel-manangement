import {
  createBooking,
  deleteBooking,
  finalizeBooking,
  getAllBookings,
  getHistoryBooking,
  handleCheckIn,
  handleCheckOut,
  updateBooking,
} from "@/controllers/booking.controller";
import { verifyToken } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.get("/", getAllBookings);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
router.post("/:id/checkin", handleCheckIn);
router.post("/:id/checkout", handleCheckOut);
router.post("/:id/checkout", handleCheckOut);
router.post("/finalize", verifyToken, finalizeBooking);
router.get("/history", verifyToken, getHistoryBooking);

export default router;
