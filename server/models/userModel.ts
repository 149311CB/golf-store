import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

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

export class userTypes extends BasicInfo {
  _id?: string;
  // firstName: string;
  // lastName: string;
  // email: string;
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
    // this.firstName = firstName;
    // this.lastName = lastName;
    // this.email = email;
    this.password = password;
    this.refreshToken = refreshToken;
    this.isActive = isActive;
    this.emailVerification = emailVerification;
    this.phoneNumber = phoneNumber;
    this.facebookId = facebookId;
    this.googleId = googleId;
  }
}

const userSchema = new Schema<userTypes>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  emailVerification: {
    type: String,
    default: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
  facebookId: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  if (!this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model("User", userSchema, "users");

export default User;
