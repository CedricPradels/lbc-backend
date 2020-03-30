import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Offer from "../models/Offer";
import { getTokenFromRequest } from "../functions/authentication";

export const createOffer = async (req: any, res: Response) => {
  try {
    const { title, description, price } = req.fields;
    const user = await User.findOne({ token: getTokenFromRequest(req) }).select(
      "_id"
    );
    const newOffer = await new Offer({
      title,
      description,
      price,
      created: Date.now(),
      creator: user?._id
    }).save();

    const offer = await Offer.findById(newOffer._id).populate({
      path: "creator",
      select: "account _id"
    });
    res.status(200).json(offer);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const checkPublishOfferDatas = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { title, description, price } = req.fields;
  if (title.length > 50) {
    res.status(400).json({ error: "Title is too long (max. 50 chars)" });
  } else if (description.length > 500) {
    res.status(400).json({ error: "Description is too long (max. 500 chars)" });
  } else if (price > 100000) {
    res.status(400).json({ error: "Price is too hight (max. 100 000 €)" });
  } else {
    next();
  }
};
