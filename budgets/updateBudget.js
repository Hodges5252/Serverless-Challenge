const {ddbDocClient, GetCommand, PutCommand} = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');
const { validateData } = require('../common/validationHelper');
const { budgetSchema } = require('./budgetSchema');
const { isValidPercentage } = require('./budgetUtil');

module.exports = async (event) => {
    try {
        const { budgetId } = event.pathParameters;
        const data = JSON.parse(event.body);

        // Validate input data against the schema
        validateData(data, budgetSchema);

        // Ensure total category percentages add up to 100
        if (!isValidPercentage(data.categories)) {
            return errorResponse('Total percentage must equal 100');
        }

        // Optional: Check if the budget exists before updating
        const existingBudget = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.BUDGET_TABLE,
                Key: { budgetId },
            })
        );

        if (!existingBudget.Item) {
            return errorResponse('Budget not found');
        }

        // Prepare the updated budget object
        const updatedBudget = {
            ...existingBudget.Item,
            ...data,
            updatedAt: new Date().toISOString().split('T')[0],
        };

        // Update the budget in DynamoDB
        await ddbDocClient.send(
            new PutCommand({
                TableName: process.env.BUDGET_TABLE,
                Item: { ...updatedBudget, budgetId },
            })
        );

        // Respond with the updated budget
        return successResponse(updatedBudget);
    } catch (err) {
        console.error('Error updating budget:', err);
        return errorResponse(err.message || 'Failed to update budget');
    }
};
