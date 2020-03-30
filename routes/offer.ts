import { Router } from "express";
const router = Router();

import { isAuthenticated } from "../middleware/isAuthenticated";
import { createOffer, checkPublishOfferDatas } from "../middleware/offer";

router.post(
  "/offer/publish",
  isAuthenticated,
  checkPublishOfferDatas,
  createOffer
);

export default router;
