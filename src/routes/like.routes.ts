import { Router } from "express";
import LikeController from "../controllers/like.controller";
import authMiddleware from "../middleware/auth.middleware";

const routes = () => {
  const router = Router();
  const controller = new LikeController();

  router.get("/", authMiddleware, controller.list);
  router.get("/:id",authMiddleware, controller.show);
  //router.put("/:id", controller.update);
  router.post("/:id",authMiddleware, controller.create);
  router.delete("/:id",authMiddleware, controller.delete);

  return router;
};

export default routes;
