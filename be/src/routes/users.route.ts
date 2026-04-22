import {
  deleteUser,
  getAllUsers,
  profile,
} from "@/controllers/user.controller";
import { verifyToken } from "@/middleware/auth";
import express from "express";

const router = express.Router();
router.get("/profile", verifyToken, profile);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

export default router;
