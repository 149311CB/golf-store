import User, { userTypes } from "../../../../models/userModel";
import { generateRefreshToken } from "../../../../utils/generateToken";
import { IAuthenticationStrategy } from "./AuthStrategy";
import { LocalValidation } from "./LocalStrategy";

// context class
export class AuthRequest {
  _validateStrategy: IAuthenticationStrategy;

  constructor(validateStrategy: IAuthenticationStrategy) {
    this._validateStrategy = validateStrategy;
  }

  async verify(): Promise<userTypes> {
    const profile = await this._validateStrategy.authenticate();
    let user = profile as userTypes;
    if (!(this._validateStrategy instanceof LocalValidation)) {
      const exist = await User.findOne({ email: user.email });

      if (exist) {
        return exist;
      }
      user = await this.createUser(profile);
    }
    return user;
  }

  private async createUser(user: any): Promise<userTypes> {
    console.log(user);
    const newUser = await User.create(user);
    newUser.refreshToken = generateRefreshToken({ userId: newUser });
    await newUser.save();
    return newUser;
  }
}
