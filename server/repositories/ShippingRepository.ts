import { model, Model, Schema } from "mongoose";
import Address from "../types/Address";
import UserRepository from "./UserRepository";

export default class AddressRepository {
  addressSchema = new Schema<Address>({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    apt: {
      type: String,
      required: false,
    },
    isPrimary: {
      type: Boolean,
      required: true,
    },
  });

  model: Model<Address, any, any>;
  private static instance: AddressRepository;

  private constructor() {
    UserRepository.getInstance();
    this.model = model<Address>("Address", this.addressSchema, "addresses");
  }

  public static getInstance(): Model<Address, any, any> {
    if (!AddressRepository.instance) {
      AddressRepository.instance = new AddressRepository();
    }
    return AddressRepository.instance.model;
  }
}
