// EXPRESS
import { Router } from "express";
const router = Router();

// MIDDLEWARE
import { createUser, checkCreateUserDatas, login } from "../middleware/user";

router.post("/user/sign_up", checkCreateUserDatas, createUser);
router.post("/user/log_in", login);

export default router;
