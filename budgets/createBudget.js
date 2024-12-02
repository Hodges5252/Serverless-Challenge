const {ddbDocClient,PutCommand} = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');
const { validateData } = require('../common/validationHelper');
const { budgetSchema } = require('./budgetSchema');
const { isValidPercentage } = require('./budgetUtil');

module.exports = async (event) => {
    try {
        const data = (() => {
            try {
                return JSON.parse(event.body);
            } catch {
                throw new Error('Invalid input data');
            }
        })();

        // Validate input
        validateData(data, budgetSchema);

        if (!isValidPercentage(data.categories)) {
            return errorResponse('Total percentage must equal 100');
        }

        const newBudget = {
            ...data,
            createdAt: new Date().toISOString().split('T')[0],
        };

        await ddbDocClient.send(
            new PutCommand({
                TableName: process.env.BUDGET_TABLE,
                Item: newBudget,
            })
        );

        return successResponse(newBudget);
    } catch (err) {
        console.error(err);
        return errorResponse(err.message || 'Failed to create budget');
    }
};
