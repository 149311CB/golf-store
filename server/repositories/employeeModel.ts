import { Model, model, PopulateOptions, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { EmployeeTypes, IPermission, IRole } from "../types/userTypes";

export class RoleRepository {
  permissionSchema = new Schema<IPermission>({
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

  role = new Schema<IRole>({
    name: { type: String, required: true },
    permissions: {
      type: [this.permissionSchema],
      required: true,
    },
  });

  roleModel: Model<IRole, any, any>;
  private static instance: RoleRepository;

  private constructor() {
    this.roleModel = model("Role", this.role, "roles");
  }

  public static getInstance() {
    if (!RoleRepository.instance) {
      RoleRepository.instance = new RoleRepository();
    }
    return RoleRepository.instance;
  }
}

export default class EmployeeRepository {
  private employeeSchema = new Schema<EmployeeTypes>({
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

  private model: Model<EmployeeTypes, any, any>;
  private static instance: EmployeeRepository;

  private constructor() {
    this.employeeSchema.methods.matchPassword = async function (
      enteredPassword
    ) {
      if (!this.password) {
        return;
      }
      return await bcrypt.compare(enteredPassword, this.password);
    };

    this.employeeSchema.pre("save", async function (next) {
      if (!this.isModified("password")) {
        next();
      }
      if (!this.password) {
        return;
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    });

    RoleRepository.getInstance();
    this.model = model("Employee", this.employeeSchema, "employees");
  }

  public static getInstance(): EmployeeRepository {
    if (!EmployeeRepository.instance) {
      EmployeeRepository.instance = new EmployeeRepository();
    }
    return EmployeeRepository.instance;
  }

  async findById(
    id: string,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<EmployeeTypes | null> {
    return await this.model.findById(id).populate(options);
  }

  async findByEmail(
    email: string,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<EmployeeTypes | null> {
    return await this.model.findOne({ email: email }).populate(options);
  }

  async updateInfo(exist: any): Promise<EmployeeTypes | null> {
    return await exist.save();
  }
}
