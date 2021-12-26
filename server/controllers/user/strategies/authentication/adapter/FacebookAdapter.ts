import {IUserInfoAdapter} from "./IUserInfoAdapter";
import {UserTypes} from "../../../../../types/userTypes";
import {IPublicProfile} from "../FacebookStrategy";

export class FacebookAdapter implements IUserInfoAdapter {
    publicProfile: IPublicProfile;

    constructor(publicProfile: IPublicProfile) {
        this.publicProfile = publicProfile;
    }

    getMissingFields(): any {
        return Object.entries(this.publicProfile).map((key, value) => {
            if (!value) {
                return key;
            }
        });
    }

    transform(): UserTypes {
        const profile = this.publicProfile;

        if (!profile.first_name || !profile.last_name || !profile.email) {
            throw new Error(
                `invalid user profile, required ${this.getMissingFields()}`
            );
        }

        const user = new UserTypes(
            profile.first_name,
            profile.last_name,
            profile.email
        );
        user.facebookId = profile.id;
        return user;
    }

    adapt(): UserTypes {
        return this.transform();
    }
}