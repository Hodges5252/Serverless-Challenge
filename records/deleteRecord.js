const {ddbDocClient, DeleteCommand} = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');

module.exports = async (event) => {
    try {
        const { recordId } = event.pathParameters;

        await ddbDocClient.send(
            new DeleteCommand({
                TableName: process.env.RECORDS_TABLE,
                Key: { recordId },
            })
        );

        return successResponse({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error(err);
        return errorResponse(err.message || 'Failed to delete record');
    }
};
