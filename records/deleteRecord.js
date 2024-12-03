const { ddbDocClient, DeleteCommand } = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');

module.exports = async (event) => {
    try {
        const { recordId } = event.pathParameters;

        if (!recordId) {
            return errorResponse('recordId is required');
        }

        const params = {
            TableName: process.env.RECORDS_TABLE,
            Key: { recordId },
        };

        await ddbDocClient.send(new DeleteCommand(params));

        return successResponse({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error('Error deleting record:', err);
        return errorResponse(err.message || 'Failed to delete record');
    }
};
