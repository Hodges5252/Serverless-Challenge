const Joi = require('joi');

const recordSchema = Joi.object({
    recordId: Joi.string().required(),
    budgetId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    date: Joi.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/) // Match YYYY-MM-DD format
        .optional(),
});

module.exports = { recordSchema };
