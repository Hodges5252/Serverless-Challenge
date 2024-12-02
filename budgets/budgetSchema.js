const Joi = require('joi');

module.exports = {
    budgetSchema: Joi.object({
        budgetId: Joi.string().required(),
        categories: Joi.array()
            .items(
                Joi.object({
                    categoryName: Joi.string().required(),
                    percentage: Joi.number().min(0).max(100).required(),
                })
            )
            .min(1)
            .required(),
    }),
};