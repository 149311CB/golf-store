import {model, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import { EmployeeTypes } from "../types/userTypes";

const employeeSchema = new Schema<EmployeeTypes>({
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
  password: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

employeeSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  if (!this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Employee = model("Employee", employeeSchema, "employees");

export default Employee;
