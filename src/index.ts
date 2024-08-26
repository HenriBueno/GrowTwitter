import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import tweetsRoutes from "./routes/tweets.routes";
import likesRoutes from "./routes/like.routes";

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;

app.use("/users", userRoutes());
app.use("/auth", authRoutes());
app.use("/tweets", tweetsRoutes());
app.use("/likes", likesRoutes());

app.listen(port, () => {
  console.log(`------ Server is runing ${port} -------`);
});
