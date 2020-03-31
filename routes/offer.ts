import { Router } from "express";
const router = Router();

import { isAuthenticated } from "../middleware/isAuthenticated";
import {
  createOffer,
  checkPublishOfferDatas,
  getOffers,
  getOffer
} from "../middleware/offer";

router.post(
  "/offer/publish",
  isAuthenticated,
  checkPublishOfferDatas,
  createOffer
);
router.get("/offer/with-count", getOffers);
router.get("/offer/:offerId", getOffer);
export default router;
