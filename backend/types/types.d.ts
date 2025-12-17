import { ObjectId } from "mongodb"; // or from "mongoose"

interface IUser {
  _id: ObjectId;
  email: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: IUser;
    }
  }
}

export {};
