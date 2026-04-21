import { profile } from "@/controllers/user.controller";
import { verifyToken } from "@/middleware/auth";
import express from "express";

const router = express.Router();
router.get("/profile", verifyToken, profile);

export default router;
