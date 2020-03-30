import {
  isEmail,
  isFilled,
  isKeyValueFreeInCollection
} from "../functions/checks";
import { NextFunction, Response } from "express";
import {
  createAuthenticationDatas,
  checkPassword
} from "../functions/authentication";
import User, { userModel } from "../models/User";

export enum QueryUserSelect {
  default = "",
  secure = "-salt -hash -__v",
  authentication = "salt hash",
  offer = "account _id"
}

export const checkCreateUserDatas = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { username, email } = req.fields;
  const isEmailValueFreeInUser = isKeyValueFreeInCollection(User)("email");
  if (!isFilled(username)) {
    res.status(400).json({ error: "User name is empty" });
  } else if (!isEmail(email)) {
    res.status(400).json({ error: "Email is not correct" });
  } else if (!(await isEmailValueFreeInUser(email))) {
    res.status(400).json({ error: "Email already exist in DB." });
  } else {
    next();
  }
};

export const createUser = async (req: any, res: Response) => {
  try {
    const { password, username, phone, email } = req.fields;
    const { token, hash, salt } = createAuthenticationDatas(password);
    const newUser = await new User({
      email,
      token,
      hash,
      salt,
      account: {
        username,
        phone
      }
    }).save();

    const user = await User.findById(newUser._id).select(
      QueryUserSelect.secure
    );

    res.status(200).json(user);
  } catch (error) {
    console.log("error : ", error);
    res.status(400).json({ message: "error" });
  }
};

export const login = async (req: any, res: Response) => {
  try {
    const { email, password } = req.fields;
    const authenticationDatas: any = await User.findOne({ email }).select(
      QueryUserSelect.authentication
    );

    if (
      !checkPassword(authenticationDatas.salt)(authenticationDatas.hash)(
        password
      )
    ) {
      res.status(400).json({ error: "Authentication failed." });
    } else {
      const user = await User.findOne({ email }).select(QueryUserSelect.secure);
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
};
