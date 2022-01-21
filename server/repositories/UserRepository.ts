import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserTypes } from "../types/userTypes";

const userSchema = new Schema<UserTypes>({
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
  avatar: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/avatar.svg?alt=media&token=ba3ea983-3133-41d9-88c4-002deffd991a",
  },
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) {
    return;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  if (!this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const UserRepository = model("User", userSchema, "users");

export default UserRepository;

