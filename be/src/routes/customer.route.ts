import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
} from "@/controllers/customer.controller";
import express from "express";

const router = express.Router();

router.get("/", getAllCustomers);
router.post("/", createCustomer);
router.delete("/:id", deleteCustomer);

export default router;
