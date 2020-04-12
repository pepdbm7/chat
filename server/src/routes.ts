import { Router, Request, Response } from "express";
// node core:
import path from "path";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Server working!");
});

router.get("*", (req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

export default router;
