import { userTypes } from "./models/userModel";

declare global {
  namespace Express {
    interface Request {
      user: userTypes;
      register: Boolean;
    }
  }
}

// declare namespace e {
//   export interface Request {
//     user: userTypes;
//   }
// }
