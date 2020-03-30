import { Response, Request, NextFunction } from "express";
import { getTokenFromRequest } from "../functions/authentication";
import User from "../models/User";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFromRequest(req);
    const user: any = await User.findOne({ token }).select("token");
    if (token === undefined) {
      res.status(400).json({ error: "Missing token" });
    } else if (!user) {
      res.status(400).json({ error: "Wrong token" });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
