import { Request, Response } from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";
import { hash } from "bcrypt";
import * as bcrypt from "bcrypt";

class UserController {
  public async create(req: Request, res: Response) {
    const { name, email, password, userName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: true, msg: "Required fields." });
    }

    try {
      const userFind = await db.users.findUnique({
        where: { email },
      });

      if (!userFind) {
        const hash = generateHash(password);
        const newUser = await db.users.create({
          data: { password: hash, email, name, userName },
        });

        // console.log(hash);
        return res
          .status(200)
          .json({ success: true, msg: `${newUser.name} created success` });
      }
      return res.status(400).json({ success: true, msg: "User exist." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const users = await db.users.findMany();
      return res
        .status(200)
        .json({ success: true, msg: "List users.", data: users });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const showUser = await db.users.findUnique({
        where: { id },
      });
      return res.status(200).json({
        success: true,
        msg: `Here is your username.`,
        data: showUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async update(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.params;
    const { name, password, userName } = req.body;

    try {
      const user = await db.users.findFirst({ where: { token } });
      if (!user) {
        console.log("error");
        return res.status(400).json({ success: false, msg: "Invalid User" });
      }

      if(name || password || userName){

        await db.users.update({
          where: {
            id,
          },
          data: {
            name,
            password,
            userName
          },
        })
        return res.status(200).json({ success: true, msg: "User updated." });

      }

      return res.status(400).json({ success: true, msg: "User not updated." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const token = req.headers.authorization;
    const { id } = req.params;
    const { email, password } = req.body;

    try {
      const user = await db.users.findFirst({ where: { token } });
      if (!user) {
        return res.status(400).json({ success: false, msg: "Invalid User." });
      }
      if (user.id !== id) {
        return res.status(403).json({ success: false, msg: "You can only delete your own account." });
      }
  
      if (!password || !email) {
        return res.status(400).json({ success: false, msg: "Required fields: email and password." });
      }
  
      if (user.email !== email || !bcrypt.compareSync(password, user.password || "")) {
        return res
          .status(401)
          .json({ success: false, msg: "Email or password incorrect." });
      }

      await db.likes.deleteMany({
        where: { userId: user.id },
      });

      await db.tweets.deleteMany({
        where: { userId: user.id },
      });

      await db.users.delete({
        where: { id: user.id},
      });

      return res.status(200).json({ success: true, msg: "User deleted successfully." });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  

}

export default UserController;
