import { Request, Response } from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";
import { hash } from "bcrypt";
import { TweetType } from "@prisma/client";

class LikeController {
  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { userId, tweetId } = req.body;
    try {
      const user = await db.users.findFirst({ where: { token } });

      if (!user) {
        console.log("error");
        return res.status(400).json({ success: false, msg: "Invalid User" });
      }
      if (!userId) {
        return res.status(400).json({ success: false, msg: "User not found" });
      }
      if (!tweetId) {
        return res.status(400).json({ success: false, msg: "tweet not found" });
      }

      const like = await db.likes.findFirst({
        where: { userId, tweetId },
      });

      if (like) {
        return res
          .status(400)
          .json({ success: false, msg: "You already liked this post." });
      }

      const newLike = await db.likes.create({
        data: { userId, tweetId },
      });
      return res.status(200).json({
        success: true,
        msg: "Like performed successfully",
        data: newLike,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async list(req: Request, res: Response) {
    const token = req.headers.authorization;
    try {
      const user = await db.users.findFirst({ where: { token } });
      if (!user) {
        console.log("error");
        return res.status(400).json({ success: false, msg: "Invalid User" });
      }

      const likes = await db.likes.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "List likes.", data: likes });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async show(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.params;
    try {
      const user = await db.users.findFirst({ where: { token } });
      if (!user) {
        console.log("error");
        return res.status(400).json({ success: false, msg: "Invalid User" });
      }

      const like = await db.likes.findUnique({
        where: { id },
      });
      return res.status(200).json({
        success: true,
        msg: `Here is your like.`,
        data: like,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.body;

    try {
      const user = await db.users.findFirst({ where: { token } });
      if (!user) {
        console.log("error");
        return res.status(400).json({ success: false, msg: "Invalid User" });
      }

      const like = await db.likes.findUnique({
        where: {
          id,
        },
      });
      if (!like) {
        return res.status(400).json({ success: false, msg: "like not found" });
      }
      if (!id) {
        return res.status(400).json({ success: false, msg: "like not exist" });
      }

      await db.likes.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({ success: true, msg: "like deleted." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}
export default LikeController;
