import User from "../../../../models/userModel";
import { generateRefreshToken } from "../../../../utils/generateToken";
import { IAuthenticationStrategy } from "./AuthStrategy";
import { LocalValidation } from "./LocalStrategy";
import {UserTypes} from "../../../../types/userTypes";

// context class
export class AuthRequest {
  _validateStrategy: IAuthenticationStrategy;

  constructor(validateStrategy: IAuthenticationStrategy) {
    this._validateStrategy = validateStrategy;
  }

  async verify(): Promise<UserTypes> {
    const profile = await this._validateStrategy.authenticate();
    let user = profile as UserTypes;
    if (!(this._validateStrategy instanceof LocalValidation)) {
      const exist = await User.findOne({ email: user.email });

      if (exist) {
        return exist;
      }
      user = await AuthRequest.createUser(profile);
    }
    return user;
  }

  private static async createUser(user: any): Promise<UserTypes> {
    console.log(user);
    const newUser = await User.create(user);
    newUser.refreshToken = generateRefreshToken({ userId: newUser });
    await newUser.save();
    return newUser;
  }
}
