import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { UniqueConstraintError, ValidationError as SequelizeValidationError } from "sequelize";
import { AppError } from "../shared/AppError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: err.issues,
      },
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      error: {
        code: "CONFLICT",
        message: err.errors[0]?.message ?? "Unique constraint violated",
      },
    });
    return;
  }

  if (err instanceof SequelizeValidationError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: err.errors[0]?.message ?? "Validation failed",
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Internal server error" },
  });
};
