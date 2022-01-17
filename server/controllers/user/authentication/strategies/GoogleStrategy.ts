import {httpHelper} from "../../../../utils/httpHelper";
import jwt from "jsonwebtoken";
import {IAuthenticationStrategy} from "../IAuthenticationStrategy";
import {UserTypes} from "../../../../types/userTypes";
import {GoogleAdapter} from "../adapter/GoogleAdapter";

export interface IUserProfile {
  aud: string | undefined;
  exp: string | undefined;
  iat: string | undefined;
  iss: string | undefined;
  sub: string | undefined;
  email: string;
  email_verified?: boolean;
  given_name: string;
  family_name: string;
  at_hash?: string;
  azp?: string;
  hd?: string;
  locale?: string;
  name?: string;
  nonce?: string;
  picture?: string;
  profile?: string;
}

export interface ITokenResults {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

export class GoogleStrategy implements IAuthenticationStrategy {
  _code: string;

  constructor(code: string) {
    this._code = code;
  }

  async getAccessToken(data: any): Promise<ITokenResults | null> {
    let tokens: ITokenResults | null = null;
    // exchanging code to retrieve access token
    await httpHelper
      .post(
        "oauth2.googleapis.com",
        "/token",
        {
          "Content-Type": "application/json",
        },
        data
      )
      .then((response) => {
        tokens = response as ITokenResults;
      })
      .catch((err) => {
        console.log(err);
      });
    return tokens;
  }

  async authenticate(): Promise<UserTypes | null> {
    // initialized data to post to Google's authentication server
    const data = {
      code: this._code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri:
        "https://localhost:5001/api/user/auth/login/google/callback",
      grant_type: "authorization_code",
    };

    // get access token
    const tokens = await this.getAccessToken(data);

    // get user info
    let userInfo = jwt.decode(tokens?.id_token as string) as IUserProfile;

    const adapter = new GoogleAdapter(userInfo);
    return adapter.adapt();
  }
}

