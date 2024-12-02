const { ddbDocClient, GetCommand, DeleteCommand } = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');

module.exports = async (event) => {
    try {
        const { recordId } = event.pathParameters;

        const getResult = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.RECORDS_TABLE,
                Key: { recordId },
            })
        );

        if (!getResult.Item) {
            return errorResponse('Record not found');
        }

        const { budgetId } = getResult.Item;

        await ddbDocClient.send(
            new DeleteCommand({
                TableName: process.env.RECORDS_TABLE,
                Key: { recordId, budgetId },
            })
        );

        return successResponse({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error('Error deleting record:', err);
        return errorResponse(err.message || 'Failed to delete record');
    }
};
