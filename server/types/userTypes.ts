export class BasicInfo {
    firstName: string;
    lastName: string;
    email: string;

    constructor(firstName: string, lastName: string, email: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}

export class UserTypes extends BasicInfo {
    _id?: string;
    password?: string;
    refreshToken?: string;
    isActive?: boolean;
    emailVerification?: boolean;
    phoneNumber?: string;
    facebookId?: string;
    googleId?: string;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        password?: string,
        refreshToken?: string,
        isActive?: boolean,
        emailVerification?: boolean,
        phoneNumber?: string,
        facebookId?: string,
        googleId?: string
    ) {
        super(firstName, lastName, email);
        this.password = password;
        this.refreshToken = refreshToken;
        this.isActive = isActive;
        this.emailVerification = emailVerification;
        this.phoneNumber = phoneNumber;
        this.facebookId = facebookId;
        this.googleId = googleId;
    }
}