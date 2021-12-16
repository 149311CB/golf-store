import { IAuthenticationStrategy } from "./AuthStrategy";
import { httpHelper } from "../../httpHelper";
import User, { userTypes } from "../../../../models/userModel";
import { generateRefreshToken } from "../../../../utils/generateToken";
import { ITokenResults } from "./GoogleStrategy";

export interface IPublicProfile {
  id: string | undefined;
  name: string | undefined;
  first_name?: string;
  last_name?: string;
  email?: string;
  picture?: object;
}

export class FacebookStrategy implements IAuthenticationStrategy {
  _code: string;
  _profile: IPublicProfile = {
    id: undefined,
    name: undefined,
  };

  constructor(code: string) {
    this._code = code;
  }

  async getAccessToken(): Promise<ITokenResults | null> {
    let tokens: ITokenResults | null = null;
    await httpHelper
      .get("graph.facebook.com", "/v12.0/oauth/access_token", {
        client_id: process.env.FACEBOOK_APP_ID,
        redirect_uri:
          "https://localhost:5001/api/user/auth/login/facebook/callback",
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code: this._code,
      })
      .then((response) => {
        tokens = response;
      })
      .catch((err) => {
        console.log(err);
      });
    return tokens;
  }

  async inspectToken(access_token: string) {
    console.log(access_token);
    let userInfo: any = null;
    await httpHelper
      .get("graph.facebook.com", "/debug_token", {
        input_token: access_token,
        access_token: "1017555985458400|1FvqySzrvcTN0Lczx1w6O6dC2A8",
      })
      .then((response) => {
        userInfo = response;
      })
      .catch((error) => {
        return error;
      });
    return userInfo;
  }

  async getUserInfo(
    user_id: string,
    access_token: string
  ): Promise<IPublicProfile> {
    console.log(user_id);
    let userInfo: any = null;
    await httpHelper
      .get("graph.facebook.com", `/${user_id}`, {
        fields: "id,name,first_name,last_name,email,picture",
        access_token,
      })
      .then((response) => {
        userInfo = response;
      })
      .catch((error) => {
        return error;
      });
    return userInfo as IPublicProfile;
  }

  async authenticate(): Promise<any> {
    // get access token
    const tokens = await this.getAccessToken();
    if (!tokens) {
      return null;
    }
    // inspect token to get user id
    const { data } = await this.inspectToken(tokens.access_token);

    // get user info by id
    const userInfo = await this.getUserInfo(data.user_id, tokens.access_token);
    this._profile = userInfo;

    return {
      firstName: userInfo.first_name,
      lastName: userInfo.last_name,
      email: userInfo.email,
      facebookId: userInfo.id,
    };
  }
}
