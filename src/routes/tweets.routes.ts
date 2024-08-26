import { Router } from "express";
import UserController from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import TweetController from "../controllers/tweet.controller";

const routes = () => {
  const router = Router();
  const controller = new TweetController();

  router.get("/", authMiddleware,controller.list);
  router.get("/:id", authMiddleware,controller.show);
  router.put("/:id", authMiddleware,controller.update);
  router.post("/:id", authMiddleware, controller.create);
  router.delete("/:id",authMiddleware,controller.delete);
  return router;
};

export default routes;
