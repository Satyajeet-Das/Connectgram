import {Router} from "express";
import * as UserControllers from "../controllers/user.controller";

const router: Router = Router();

router.post("/register", UserControllers.registerUser);
router.post("/login", UserControllers.loginUser);
router.post("/logout", UserControllers.logout);
router.post("/forgotPassword", UserControllers.forgotPassword);
router.post("/resetPassword", UserControllers.verifyAndResetPassword);

export default router;