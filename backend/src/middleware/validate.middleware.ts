import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};
        err.errors.forEach((e) => {
          const field = e.path.join('.') || 'body';
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(e.message);
        });

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: formattedErrors,
        });
        return;
      }
      next(err);
    }
  };
};
