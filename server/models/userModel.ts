import { Document, Model, model, PopulateOptions, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserTypes } from "../types/userTypes";

// export default User;

class User {
  userSchema = new Schema<UserTypes>({
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

  private model: Model<UserTypes, any, any>;
  private static instance: User;
  constructor() {
    this.userSchema.methods.matchPassword = async function (enteredPassword) {
      if (!this.password) {
        return;
      }
      return await bcrypt.compare(enteredPassword, this.password);
    };

    this.userSchema.pre("save", async function (next) {
      if (!this.isModified("password")) {
        next();
      }
      if (!this.password) {
        return;
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    });
    this.model = model("User", this.userSchema, "users");
  }

  public static getInstance(): User {
    if (!User.instance) {
      User.instance = new User();
    }
    return User.instance;
  }

  async findById(
    id: string,
    select?: string,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<UserTypes & Document<any, any, UserTypes>> {
    return await this.model.findById(id).select(select).populate(options);
  }

  async findOne(
    query: any,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<UserTypes & Document<any, any, UserTypes>> {
    return await this.model.findOne(query).populate(options);
  }

  async findByEmail(
    email: string,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<UserTypes | null> {
    return await this.model.findOne({ email: email }).populate(options);
  }

  async updateInfo(
    exist: any
  ): Promise<UserTypes & Document<any, any, UserTypes>> {
    return await exist.save();
  }

  async create(
    user: UserTypes
  ): Promise<UserTypes & Document<any, any, UserTypes>> {
    return await this.model.create(user);
  }
}

export default User;
