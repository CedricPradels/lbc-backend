import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Offer from "../models/Offer";
import { getTokenFromRequest } from "../functions/authentication";
import { QueryUserSelect } from "./user";

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, price } = (req.fields as unknown) as {
    title: string;
    description: string;
    price: number;
  };
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

enum Prices {
  min = "0",
  max = "100000"
}

enum Sort {
  priceDesc = "price-desc",
  priceAsc = "price-asc",
  dateDesc = "date-desc",
  dateAsc = "date-asc"
}

const sortBy = (sortType: Sort): string => {
  let sort: string;
  switch (sortType) {
    case Sort.priceAsc:
      sort = "price";
      break;
    case Sort.priceDesc:
      sort = "-price";
      break;
    case Sort.dateAsc:
      sort = "date";
      break;
    case Sort.dateDesc:
      sort = "-date";
      break;
  }
  return sort;
};

export const getOffers = async (req: Request, res: Response) => {
  try {
    const {
      title = "",
      priceMin = Prices.min,
      priceMax = Prices.max,
      sort: querySort = Sort.dateDesc
    } = req.query;

    const filter = {
      price: { $gte: priceMin, $lte: priceMax },
      title: { $regex: RegExp(title, "i") }
    };

    let { page = 1 } = req.query;
    page = Number(page);

    const offers = await Offer.find(filter)
      .populate({
        path: "creator",
        select: QueryUserSelect.offer
      })
      .select("-__v")
      .sort(sortBy(querySort))
      .skip(3 * (page - 1))
      .limit(3);

    const count = await Offer.countDocuments(filter);

    res.status(200).json({ count, offers });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getOffer = async (req: Request, res: Response) => {
  try {
    const { offerId } = req.params;
    const offer = await Offer.findById(offerId)
      .populate({ path: "creator", select: QueryUserSelect.offer })
      .select("-__v");
    res.status(200).json(offer);
  } catch (error) {
    res.status(400).json(error);
  }
};
