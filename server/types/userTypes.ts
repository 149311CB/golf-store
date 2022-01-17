export class BasicInfo {
  _id?: string;
  password?: string;
  refreshToken?: string;
  isActive?: boolean;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password?: string,
    refreshToken?: string,
    isActive?: boolean,
    avatar?:string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.refreshToken = refreshToken;
    this.isActive = isActive;
    this.avatar = avatar
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

export interface IPermission {
  resource: string;
  read: boolean;
  write: boolean;
}

export interface IRole {
  name: string;
  permissions: [IPermission];
}

export class EmployeeTypes extends BasicInfo {
  role: IRole;
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    role: IRole,
    password?: string,
    refreshToken?: string,
    isActive?: boolean
  ) {
    super(firstName, lastName, email, password, refreshToken, isActive);
    this.role = role;
  }
}
