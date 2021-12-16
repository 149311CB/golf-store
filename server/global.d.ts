import {UserTypes} from "./types/userTypes";

declare global {
  namespace Express {
    interface Request {
      user: UserTypes;
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
