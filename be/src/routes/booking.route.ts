import {
  createBooking,
  deleteBooking,
  getAllBookings,
  handleCheckIn,
  handleCheckOut,
  updateBooking,
} from "@/controllers/booking.controller";
import express from "express";

const router = express.Router();

router.get("/", getAllBookings);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
router.patch("/:id/checkin", handleCheckIn);
router.patch("/:id/checkout", handleCheckOut);

export default router;
