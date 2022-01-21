import UserRepository from "../../../repositories/UserRepository";
import { generateRefreshToken } from "../../../utils/generateToken";
import { IAuthenticationStrategy } from "./IAuthenticationStrategy";
import { LocalValidation } from "./strategies/LocalStrategy";
import { UserTypes } from "../../../types/userTypes";

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
      const exist = await UserRepository.findOne({ email: user.email });

      if (exist) {
        exist.refreshToken = generateRefreshToken({ userId: exist._id })!;
        await exist.save();
        return exist;
      }

      user = await this.createUser(profile);
    }
    return user;
  }

  protected async createUser(user: any): Promise<UserTypes> {
    const newUser = await UserRepository.create(user);
    newUser.refreshToken = generateRefreshToken({ userId: newUser._id })!;
    await newUser.save();
    return newUser;
  }
}
