import { Router } from "express";
import { UserRepository } from "./users.repository.js";
import { UserService } from "./users.service.js";
import { UserController } from "./users.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  createUserSchema,
  updateUserSchema,
  listUsersQuerySchema,
  userIdParamSchema,
} from "./dto/user.dto.js";

const router = Router();

const repository = new UserRepository();
const service = new UserService(repository);
const controller = new UserController(service);

router.post("/", validate(createUserSchema, "body"), controller.create);
router.get("/", validate(listUsersQuerySchema, "query"), controller.list);
router.get("/:id", validate(userIdParamSchema, "params"), controller.get);
router.patch(
  "/:id",
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema, "body"),
  controller.update,
);
router.delete("/:id", validate(userIdParamSchema, "params"), controller.delete);

export default router;
