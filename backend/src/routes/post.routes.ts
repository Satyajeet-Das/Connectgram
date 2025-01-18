import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware";
import * as PostControllers from "../controllers/post.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router : Router = Router();

router.get("/all", authMiddleware, PostControllers.getMedia);
router.post("/upload", upload.array('photo', 5), authMiddleware, PostControllers.postMedia);
router.put("/update/:postId", upload.array('photo', 5), authMiddleware, PostControllers.updatePost);
router.delete("/delete/:postId", authMiddleware, PostControllers.deletePost);
router.post("/addComment/:postId", authMiddleware, PostControllers.addComment);
router.post("/addLike/:postId", authMiddleware, PostControllers.addLike);

export default router;