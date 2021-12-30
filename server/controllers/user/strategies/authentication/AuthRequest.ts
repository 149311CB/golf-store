import UserRepository from "../../../../repositories/UserRepository";
import { generateRefreshToken } from "../../../../utils/generateToken";
import { IAuthenticationStrategy } from "./AuthStrategy";
import { LocalValidation } from "./LocalStrategy";
import { UserTypes } from "../../../../types/userTypes";

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
      const exist = await UserRepository.getInstance().findOne({ email: user.email });

      if (exist) {
        exist.refreshToken = generateRefreshToken({ userId: exist._id })!;
        await UserRepository.getInstance().updateInfo(exist);
        return exist;
      }

      user = await AuthRequest.createUser(profile);
    }
    return user;
  }

  private static async createUser(user: any): Promise<UserTypes> {
    const newUser = await UserRepository.getInstance().create(user);
    newUser.refreshToken = generateRefreshToken({ userId: newUser._id })!;
    await newUser.save();
    return newUser;
  }
}
