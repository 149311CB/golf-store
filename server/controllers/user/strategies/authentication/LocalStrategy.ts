import User from "../../../../models/userModel";
import { generateRefreshToken } from "../../../../utils/generateToken";
import { IAuthenticationStrategy } from "./AuthStrategy";
import { UserTypes } from "../../../../types/userTypes";

export class LocalValidation implements IAuthenticationStrategy {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  // Check if user exist
  async authenticate(): Promise<UserTypes | null> {
    const user = await User.getInstance().findOne({ email: this.email });

    // @ts-ignore
    if (!user || !(await user.matchPassword(this.password))) {
      return null;
    }

    user.refreshToken = generateRefreshToken({ userId: user._id })!;
    await user.save();

    return user;
  }
}
