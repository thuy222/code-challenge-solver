import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

type Source = "body" | "query" | "params";

export function validate(schema: ZodSchema, source: Source = "body"): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: result.error.issues,
        },
      });
      return;
    }
    // Express 4 allows replacing these; downstream handlers read the parsed value.
    (req as Record<Source, unknown>)[source] = result.data;
    next();
  };
}
