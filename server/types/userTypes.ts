export class BasicInfo {
  _id?: string;
  password?: string;
  refreshToken?: string;
  isActive?: boolean;
  firstName: string;
  lastName: string;
  email: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password?: string,
    refreshToken?: string,
    isActive?: boolean
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.refreshToken = refreshToken;
    this.isActive = isActive;
  }
}

export class UserTypes extends BasicInfo {
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
    super(firstName, lastName, email, password, refreshToken, isActive);
    this.emailVerification = emailVerification;
    this.phoneNumber = phoneNumber;
    this.facebookId = facebookId;
    this.googleId = googleId;
  }
}

export class EmployeeTypes extends BasicInfo {
  role: string;
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    password?: string,
    refreshToken?: string,
    isActive?: boolean
  ) {
    super(firstName, lastName, email, password, refreshToken, isActive);
    this.role = role;
  }
}

