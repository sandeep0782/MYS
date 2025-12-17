import { ObjectId } from "mongodb";

export interface IUser {
  _id: ObjectId;
  email: string;
  name?: string;
}

declare global {
  namespace Express {
    // ✅ extend passport's User
    interface User extends IUser {}

    // ✅ you CAN safely add new properties here
    interface Request {
      id?: string;
    }
  }
}

export {};
