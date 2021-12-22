import {Document} from "mongoose";
import { ICartInterface } from "./types/cartType";
import { UserTypes } from "./types/userTypes";

declare global {
  namespace Express {
    interface Request {
      user: BasicInfo;
      userId: string;
      cart: ICartInterface & Document<any, any, ICartInterface>;
      cartId: string;
      register: Boolean;
      strategy: string;
    }
  }
}

// declare namespace e {
//   export interface Request {
//     user: userTypes;
//   }
// }
