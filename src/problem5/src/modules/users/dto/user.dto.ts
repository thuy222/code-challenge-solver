import { z } from "zod";

export const roleSchema = z.enum(["user", "admin"]);
export type UserRole = z.infer<typeof roleSchema>;

export const createUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().trim().min(1).max(100),
  age: z.number().int().min(0).max(150).optional(),
  role: roleSchema.optional(),
});

export const updateUserSchema = createUserSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

export const listUsersQuerySchema = z.object({
  email: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  role: roleSchema.optional(),
  minAge: z.coerce.number().int().min(0).optional(),
  maxAge: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sort: z
    .enum(["createdAt", "-createdAt", "name", "-name", "email", "-email"])
    .default("-createdAt"),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
