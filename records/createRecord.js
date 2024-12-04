const {ddbDocClient, GetCommand, PutCommand} = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');
const { validateData } = require('../common/validationHelper');
const { recordSchema } = require('./recordSchema');
const { allocateAmountToCategories } = require('./recordUtil');

// Method for creating new earning record
module.exports = async (event) => {
    try {
        const data = JSON.parse(event.body);

        // Validate input against the schema
        validateData(data, recordSchema);

        // Fetch the budget information
        const budget = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.BUDGET_TABLE,
                Key: { budgetId: data.budgetId },
            })
        );

        if (!budget.Item) {
            return errorResponse('Budget not found');
        }

        // Allocate record amount to budget categories
        const categoryAllocations = allocateAmountToCategories(budget.Item.categories, data.amount);

        const newRecord = {
            ...data,
            date: data.date || new Date().toISOString().toISOString().split('T')[0],
            categoryAllocations,
        };

        // Add the record to the database
        await ddbDocClient.send(
            new PutCommand({
                TableName: process.env.RECORDS_TABLE,
                Item: newRecord,
            })
        );

        return successResponse(newRecord);
    } catch (err) {
        console.error(err);
        return errorResponse(err.message || 'Failed to create record');
    }
};
