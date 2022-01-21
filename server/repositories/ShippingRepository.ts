import { model, Schema } from "mongoose";
import Address from "../types/Address";

const addressSchema = new Schema<Address>({
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

const AddressRepository = model<Address>("Address", addressSchema, "addresses");

export default AddressRepository;
