import {UserTypes} from "../../../../../types/userTypes";

export interface IUserInfoAdapter {
    adapt(): UserTypes;
}