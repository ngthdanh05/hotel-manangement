import {
  createRoom,
  deleteRoom,
  updateRoom,
  getRooms,
} from "@/controllers/room.controller";
import express from "express";

const router = express.Router();

router.post("/", createRoom);
router.get("/", getRooms);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
