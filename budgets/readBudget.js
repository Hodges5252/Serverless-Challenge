const {ddbDocClient, GetCommand} = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');

module.exports = async (event) => {
    try {
        const { budgetId } = event.pathParameters;

        const result = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.BUDGET_TABLE,
                Key: { budgetId },
            })
        );

        if (!result.Item) {
            return errorResponse('Budget not found');
        }

        return successResponse(result.Item);
    } catch (err) {
        console.error(err);
        return errorResponse(err.message || 'Failed to retrieve budget');
    }
};
