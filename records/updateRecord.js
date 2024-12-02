const { ddbDocClient, GetCommand, UpdateCommand } = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');
const { validateData } = require('../common/validationHelper');
const { recordSchema } = require('./recordSchema');
const { allocateAmountToCategories } = require('./recordUtil');

module.exports = async (event) => {
    try {
        const { recordId } = event.pathParameters;
        const data = JSON.parse(event.body);

        // Validate the incoming data against the schema
        validateData(data, recordSchema);

        // Fetch the associated budget to compute category allocations
        const budgetResult = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.BUDGET_TABLE,
                Key: { budgetId: data.budgetId },
            })
        );

        if (!budgetResult.Item) {
            return errorResponse('Budget not found');
        }

        // Allocate amount to categories
        const categoryAllocations = allocateAmountToCategories(budgetResult.Item.categories, data.amount);

        // Define the updatedAt timestamp
        const updatedAt = new Date().toISOString();

        // Update the record in the database
        const updateParams = {
            TableName: process.env.RECORDS_TABLE,
            Key: { recordId, budgetId: data.budgetId },
            UpdateExpression: `
                SET amount = :amount,
                    #date = :date,
                    categoryAllocations = :categoryAllocations,
                    updatedAt = :updatedAt
            `,
            ExpressionAttributeNames: {
                '#date': 'date',
            },
            ExpressionAttributeValues: {
                ':amount': data.amount,
                ':date': data.date || updatedAt,
                ':categoryAllocations': categoryAllocations,
                ':updatedAt': updatedAt,
            },
            ReturnValues: 'ALL_NEW', // Return the updated item
            ConditionExpression: 'attribute_exists(recordId) AND attribute_exists(budgetId)', // Ensure the record exists
        };

        const result = await ddbDocClient.send(new UpdateCommand(updateParams));

        // Return the updated record
        return successResponse(result.Attributes);
    } catch (err) {
        console.error('Error updating record:', err);
        return errorResponse(err.message || 'Failed to update record');
    }
};
