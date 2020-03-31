import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Offer from "../models/Offer";
import { getTokenFromRequest } from "../functions/authentication";
import { QueryUserSelect } from "./user";
import { Document } from "mongoose";

// TYPESCRIPT
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

// INTERN FUNCTIONS

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

const findOfferById = async (offerId: any) => {
  const offer = await Offer.findById(offerId)
    .populate({ path: "creator", select: QueryUserSelect.offer })
    .select("-__v");
  return offer;
};

// MIDDLEWARES

export const createOffer = async (req: Request, res: Response) => {
  try {
    // GET FRONT DATAS FROM FIELDS...
    const { title, description, price } = (req.fields as unknown) as {
      title: string;
      description: string;
      price: number;
    };
    // ...THEN FIND USER ID...
    const user = await User.findOne({ token: getTokenFromRequest(req) }).select(
      "_id"
    );
    // ... THEN CREATE A NEW OFFER...
    const newOffer = await Offer.create({
      title,
      description,
      price,
      created: Date.now(),
      creator: user?._id
    });

    // ...THEN SELECT RETURN FORMATED OBJECT
    const offer = await findOfferById(newOffer._id);
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
  // TEST ERRORS CASES...
  if (title.length > 50) {
    res.status(400).json({ error: "Title is too long (max. 50 chars)" });
  } else if (description.length > 500) {
    res.status(400).json({ error: "Description is too long (max. 500 chars)" });
  } else if (price > 100000) {
    res.status(400).json({ error: "Price is too hight (max. 100 000 €)" });
  } else {
    // ... OR GO NEXT IF YOU HAVEN'T ERRORS
    next();
  }
};

export const getOffers = async (req: Request, res: Response) => {
  try {
    const {
      title = "",
      priceMin = Prices.min,
      priceMax = Prices.max,
      sort: querySort = Sort.dateDesc
    } = req.query;

    // CREATE FILTERS
    const filters = {
      price: { $gte: priceMin, $lte: priceMax },
      title: { $regex: RegExp(title, "i") }
    };

    // CREATE PAGINATE DATAS
    let { page = 1 } = req.query;
    page = Number(page);

    // QUERY WITH FILTERS ...
    const offers = await Offer.find(filters)
      .populate({
        path: "creator",
        select: QueryUserSelect.offer
      })
      .select("-__v")
      // ... THEN SORT WITH QUERY VALUE ...
      .sort(sortBy(querySort))
      // ... THEN PAGINATE
      .skip(3 * (page - 1))
      .limit(3);

    // QUERY DOCUMENT COUNT WITH FILTER
    const count = await Offer.countDocuments(filters);

    res.status(200).json({ count, offers });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getOffer = async (req: Request, res: Response) => {
  try {
    const { offerId } = req.params;

    const offer = await findOfferById(offerId);
    res.status(200).json(offer);
  } catch (error) {
    res.status(400).json(error);
  }
};
