import { getAvailableRooms } from "controllers/room.controller";
import express from "express";

const router = express.Router();

router.get("/", getAvailableRooms);

export default router;
