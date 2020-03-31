// EXPRESS
import { NextFunction, Response, Request } from "express";

// FUNCTIONS
import {
  isEmail,
  isFilled,
  isKeyValueFreeInCollection
} from "../functions/checks";
import {
  createAuthenticationDatas,
  checkPassword
} from "../functions/authentication";

// MONGOOSE
import User from "../models/User";

// TYPESCRIPT
export enum QueryUserSelect {
  default = "",
  secure = "-salt -hash -__v",
  authentication = "salt hash",
  offer = "account _id"
}

export const checkCreateUserDatas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email } = (req.fields as unknown) as {
    username: string;
    email: string;
  };
  const isEmailValueFreeInUser = isKeyValueFreeInCollection(User)("email");
  // CHECK ERRORS CASES ...
  if (!isFilled(username)) {
    res.status(400).json({ error: "User name is empty" });
  } else if (!isEmail(email)) {
    res.status(400).json({ error: "Email is not correct" });
  } else if (!(await isEmailValueFreeInUser(email))) {
    res.status(400).json({ error: "Email already exist in DB." });
  } else {
    // ... OR NEXT IF YOU HASN'T ERROR
    next();
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { password, username, phone, email } = (req.fields as unknown) as {
      password: string;
      username: string;
      phone: string;
      email: string;
    };

    // GET AUTHENTICATIONS DATAS FROM PASSWORD
    const { token, hash, salt } = createAuthenticationDatas(password);

    // CREATE NEW USER
    const newUser = await User.create({
      email,
      token,
      hash,
      salt,
      account: {
        username,
        phone
      }
    });

    // QUERY CREATED USER AND SELECT FIELDS
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

    // GET AUTHENTICATIONS DATAS
    const authenticationDatas: any = await User.findOne({ email }).select(
      QueryUserSelect.authentication
    );

    // CHECK PASSWORD
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
