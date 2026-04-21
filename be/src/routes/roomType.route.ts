import {
  createRoomType,
  deleteRoomType,
  getRoomTypes,
  updateRoomType,
} from "@/controllers/roomType.controller";
import express from "express";

const router = express.Router();

router.post("/", createRoomType);
router.get("/", getRoomTypes);
router.put("/:id", updateRoomType);
router.delete("/:id", deleteRoomType);

export default router;
