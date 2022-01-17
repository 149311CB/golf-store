import {IUserInfoAdapter} from "./IUserInfoAdapter";
import {UserTypes} from "../../../../types/userTypes";
import {IUserProfile} from "../strategies/GoogleStrategy";

export class GoogleAdapter implements IUserInfoAdapter {
    userProfile: IUserProfile;

    constructor(userProfile: IUserProfile) {
        this.userProfile = userProfile;
    }

    getMissingFields(): any {
        return Object.entries(this.userProfile).map((key, value) => {
            if (!value) {
                return key;
            }
        });
    }

    transform(): UserTypes {
        const profile = this.userProfile;

        if (!profile.given_name || !profile.family_name || !profile.email) {
            throw new Error(
                `invalid user profile, required ${this.getMissingFields()}`
            );
        }

        const user = new UserTypes(
            profile.given_name,
            profile.family_name,
            profile.email
        );
        user.facebookId = profile.sub;
        return user;
    }

    adapt(): UserTypes {
        return this.transform();
    }
}