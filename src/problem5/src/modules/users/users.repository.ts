import { Op, type WhereOptions, type Order } from "sequelize";
import { UserModel, type UserAttributes } from "./models/user.model.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  ListUsersQuery,
} from "./dto/user.dto.js";

export class UserRepository {
  create(data: CreateUserDto): Promise<UserModel> {
    return UserModel.create(data);
  }

  findById(id: string): Promise<UserModel | null> {
    return UserModel.findByPk(id);
  }

  findByEmail(email: string): Promise<UserModel | null> {
    return UserModel.findOne({ where: { email } });
  }

  async list(query: ListUsersQuery): Promise<{ rows: UserModel[]; count: number }> {
    const where: WhereOptions<UserAttributes> = {};

    if (query.email) where.email = { [Op.iLike]: `%${query.email}%` };
    if (query.name) where.name = { [Op.iLike]: `%${query.name}%` };
    if (query.role) where.role = query.role;

    if (query.minAge !== undefined || query.maxAge !== undefined) {
      const ageRange: Record<symbol, number> = {};
      if (query.minAge !== undefined) ageRange[Op.gte] = query.minAge;
      if (query.maxAge !== undefined) ageRange[Op.lte] = query.maxAge;
      where.age = ageRange;
    }

    const desc = query.sort.startsWith("-");
    const sortField = desc ? query.sort.slice(1) : query.sort;
    const order: Order = [[sortField, desc ? "DESC" : "ASC"]];

    return UserModel.findAndCountAll({
      where,
      limit: query.limit,
      offset: query.offset,
      order,
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<UserModel | null> {
    const [affected] = await UserModel.update(data, { where: { id } });
    if (affected === 0) return null;
    return UserModel.findByPk(id);
  }

  async delete(id: string): Promise<boolean> {
    const affected = await UserModel.destroy({ where: { id } });
    return affected > 0;
  }
}
