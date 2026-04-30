import {
  demoDeadlock,
  demoLostUpdate,
  demoNonRepeatableRead,
  demoPhantomRead,
  readPriceDirty,
  triggerDirtyUpdate,
  updatePriceInstant,
} from "@/controllers/demoError.controller";
import express from "express";

const router = express.Router();

router.get("/lost-update/:id", demoLostUpdate);

router.post("/dirty-update/:id", triggerDirtyUpdate);
router.get("/dirty-read/:id", readPriceDirty);

router.get("/non-repeatable-read/:id", demoNonRepeatableRead);
router.put("/update-price/:id", updatePriceInstant);

router.get("/phantom-read", demoPhantomRead);

router.post("/deadlock", demoDeadlock);

export default router;
