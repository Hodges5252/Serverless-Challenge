const {ddbDocClient, GetCommand, PutCommand} = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');
const { validateData } = require('../common/validationHelper');
const { recordSchema } = require('./recordSchema');

module.exports = async (event) => {
    try {
        const { recordId } = event.pathParameters;
        const data = JSON.parse(event.body);

        // Validate the incoming data against the schema
        validateData(data, recordSchema);

        // Check if the record exists
        const existingRecord = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.RECORDS_TABLE,
                Key: { recordId },
            })
        );

        if (!existingRecord.Item) {
            return errorResponse('Record not found');
        }

        // Prepare the updated record with a timestamp
        const updatedRecord = {
            ...existingRecord.Item,
            ...data,
            updatedAt: new Date().toISOString().toISOString().split('T')[0],
        };

        // Use UpdateCommand to update the record
        await ddbDocClient.send(
            new PutCommand({
                TableName: process.env.RECORDS_TABLE,
                Key: { recordId },
                UpdateExpression: 'SET #data = :data, updatedAt = :updatedAt',
                ExpressionAttributeNames: {
                    '#data': 'data', // Map attribute names for reserved keywords
                },
                ExpressionAttributeValues: {
                    ':data': data,
                    ':updatedAt': updatedRecord.updatedAt,
                },
            })
        );

        // Return the updated record
        return successResponse(updatedRecord);
    } catch (err) {
        console.error('Error updating record:', err);
        return errorResponse(err.message || 'Failed to update record');
    }
};
