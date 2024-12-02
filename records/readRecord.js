const {ddbDocClient, GetCommand} = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');

module.exports = async (event) => {
    try {
        const { budgetId, startDate, endDate } = event.queryStringParameters;

        const result = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.RECORDS_TABLE,
                KeyConditionExpression: 'budgetId = :budgetId',
                ExpressionAttributeValues: { ':budgetId': budgetId },
            })
        );

        const filteredRecords = result.Items.filter((record) => {
            const recordDate = record.date;
            return (!startDate || recordDate >= startDate) &&
                (!endDate || recordDate <= endDate);
        });

        return successResponse(filteredRecords);
    } catch (err) {
        console.error(err);
        return errorResponse(err.message || 'Failed to retrieve records');
    }
};
