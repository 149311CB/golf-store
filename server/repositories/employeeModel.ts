import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { EmployeeTypes, IPermission, IRole } from "../types/userTypes";

const permissionSchema = new Schema<IPermission>({
  resource: {
    type: String,
    default: "all",
  },
  read: {
    type: Boolean,
    default: false,
  },
  write: {
    type: Boolean,
    default: false,
  },
});

const role = new Schema<IRole>({
  name: { type: String, required: true },
  permissions: {
    type: [permissionSchema],
    required: true,
  },
});
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
  role: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Role",
  },
});

employeeSchema.methods.matchPassword = async function(
  enteredPassword
) {
  if (!this.password) {
    return;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

employeeSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  if (!this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const RoleRepository = model("Role", role, "roles");
const EmployeeRepository = model("Employee", employeeSchema, "employees");

export default EmployeeRepository
export { RoleRepository }
