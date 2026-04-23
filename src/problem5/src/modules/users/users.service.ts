import { AppError } from "../../shared/AppError.js";
import type { UserRepository } from "./users.repository.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  ListUsersQuery,
} from "./dto/user.dto.js";
import type { UserModel } from "./models/user.model.js";

export interface ListUsersResult {
  data: UserModel[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async create(data: CreateUserDto): Promise<UserModel> {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new AppError(409, `Email ${data.email} already in use`, "EMAIL_TAKEN");
    }
    return this.repo.create(data);
  }

  async get(id: string): Promise<UserModel> {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError(404, `User ${id} not found`, "USER_NOT_FOUND");
    return user;
  }

  async list(query: ListUsersQuery): Promise<ListUsersResult> {
    const { rows, count } = await this.repo.list(query);
    return {
      data: rows,
      pagination: {
        total: count,
        limit: query.limit,
        offset: query.offset,
      },
    };
  }

  async update(id: string, data: UpdateUserDto): Promise<UserModel> {
    if (data.email) {
      const conflict = await this.repo.findByEmail(data.email);
      if (conflict && conflict.id !== id) {
        throw new AppError(409, `Email ${data.email} already in use`, "EMAIL_TAKEN");
      }
    }
    const updated = await this.repo.update(id, data);
    if (!updated) throw new AppError(404, `User ${id} not found`, "USER_NOT_FOUND");
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new AppError(404, `User ${id} not found`, "USER_NOT_FOUND");
  }
}
