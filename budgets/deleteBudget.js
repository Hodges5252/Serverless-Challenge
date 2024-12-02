const {ddbDocClient, DeleteCommand} = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');

//Method for deleting budget
module.exports = async (event) => {
    try {
        const { budgetId } = event.pathParameters;

        //Delete budget from database
        await ddbDocClient.send(
            new DeleteCommand({
                TableName: process.env.BUDGET_TABLE,
                Key: { budgetId },
            })
        );

        return successResponse({ message: 'Budget deleted successfully' });
    } catch (err) {
        console.error(err);
        return errorResponse(err.message || 'Failed to delete budget');
    }
};
