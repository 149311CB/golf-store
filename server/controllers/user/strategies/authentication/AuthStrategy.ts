import { UserTypes } from "../../../../types/userTypes";

export interface IAuthenticationStrategy {
  // Get user profile from external authenticate provider or query form db
  authenticate(): Promise<UserTypes | null>;
}
