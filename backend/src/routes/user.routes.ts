import {Router} from "express";
import * as UserControllers from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = Router();

router.post("/register", UserControllers.registerUser);
router.post("/login", UserControllers.loginUser);
router.post("/logout", UserControllers.logout);
router.post("/checkOTP", UserControllers.checkOTP);
router.post("/forgotPassword", UserControllers.forgotPassword);
router.post("/resetPassword", UserControllers.verifyAndResetPassword);
router.get("/verify", authMiddleware, UserControllers.verifyToken);

export default router;