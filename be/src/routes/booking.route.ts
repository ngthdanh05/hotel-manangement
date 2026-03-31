import express from "express";
import {
  createBooking,
  getHistoryBookings,
} from "../controllers/booking.controller";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/history", verifyToken, getHistoryBookings);

export default router;
