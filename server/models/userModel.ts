import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export type userTypes = {
  _id?: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  email: string;
  emailVerification: boolean;
  phoneNumber: string;
  password: string;
  refreshToken: string;
  facebookId?: string;
  googleId?: string;
};

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
    required: true,
  },
  password: {
    type: String,
    required: true,
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
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model("User", userSchema, "users");

export default User;
