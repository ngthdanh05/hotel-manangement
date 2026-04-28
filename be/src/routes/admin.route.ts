import {
  getAllBookings,
  getDashboardData,
  updateBookings,
} from "@/controllers/admin.controller";
import { verifyToken } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboardData);

router.get("/bookings", verifyToken, getAllBookings);
router.put("/bookings/:id", verifyToken, updateBookings);

export default router;
