import {
  getAvailableRooms,
  getRooms,
  createRoom,
  deleteRoom,
  updateRoom,
} from "@/controllers/room.controller";
import express from "express";

const router = express.Router();

router.post("/", createRoom);
router.get("/", getRooms);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);
router.get("/getAvailableRooms", getAvailableRooms);

export default router;
