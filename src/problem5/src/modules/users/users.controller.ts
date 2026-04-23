import type { Request, Response, NextFunction } from "express";
import type { UserService } from "./users.service.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  ListUsersQuery,
} from "./dto/user.dto.js";

export class UserController {
  constructor(private readonly service: UserService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.create(req.body as CreateUserDto);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.list(req.query as unknown as ListUsersQuery);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.get(req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.update(req.params.id, req.body as UpdateUserDto);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
