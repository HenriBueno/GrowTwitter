import { Request, Response } from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";
import { hash } from "bcrypt";
import { TweetType } from "@prisma/client";

class TweetController {
  public async create(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { description, type } = req.body;
    try {
      const user = await db.users.findFirst({ where: { token } });

      if (!user) {
        console.log("error");
        return res.status(400).json({ success: false, msg: "Invalid User" });
      }

      if (!description) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid Description" });
      }
      const newTweets = await db.tweets.create({
        data: { description, type, userId: user.id },
      });

      
      return res.status(200).json({
        success: true,
        msg: "Tweet created successfully",
        data: newTweets,
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

      const tweets = await db.tweets.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "List Tweets.", data: tweets });
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

      const showTweet = await db.tweets.findUnique({
        where: { id },
      });
      return res.status(200).json({
        success: true,
        msg: `Here is your tweet`,
        data: showTweet,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async update(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.params;
    const { description, type } = req.body;

    try {
      const user = await db.users.findFirst({ where: { token } });
      if (!user) {
        console.log("error");
        return res.status(400).json({ success: false, msg: "Invalid User" });
      }

      const tweet = await db.tweets.findUnique({
        where: {
          id,
        },
      });

      if (!tweet) {
        return res.status(404).json({ success: true, msg: "Tweet not found." });
      }

      if (description) {
        await db.tweets.update({
          where: {
            id,
          },
          data: {
            description,
          },
        });

        return res.status(200).json({ success: true, msg: "Tweet updated." });
      }

      return res.status(400).json({ success: true, msg: "Tweet not updated." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.params;

    try {
      const user = await db.users.findFirst({ where: { token } });
      if (!user) {
        console.log("error");
        return res.status(400).json({ success: false, msg: "Invalid User" });
      }

      const tweet = await db.tweets.findUnique({
        where: {
          id,
        },
      });

      if (!tweet) {
        return res.status(404).json({ success: true, msg: "Tweet not found." });
      }

      await db.tweets.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({ success: true, msg: "Tweet deleted." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default TweetController;
