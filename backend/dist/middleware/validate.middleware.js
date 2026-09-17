"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const formattedErrors = {};
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
exports.validateRequest = validateRequest;
