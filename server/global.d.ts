import { userTypes } from "./models/userModel";

declare global {
  namespace Express {
    interface Request {
      user: userTypes;
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
