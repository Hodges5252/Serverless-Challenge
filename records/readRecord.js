const { ddbDocClient, QueryCommand } = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');

module.exports = async (event) => {
    try {
        const { budgetId, startDate, endDate } = event.queryStringParameters || {};

        if (!budgetId) {
            return errorResponse('budgetId is required');
        }

        let keyConditionExpression = 'budgetId = :budgetId';
        const expressionAttributeValues = { ':budgetId': budgetId };
        const expressionAttributeNames = {};

        if (startDate) {
            keyConditionExpression += ' AND #date >= :startDate';
            expressionAttributeValues[':startDate'] = startDate;
            expressionAttributeNames['#date'] = 'date';
        }
        if (endDate) {
            keyConditionExpression += ' AND #date <= :endDate';
            expressionAttributeValues[':endDate'] = endDate;
            expressionAttributeNames['#date'] = 'date';
        }

        const params = {
            TableName: process.env.RECORDS_TABLE,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues,
        };

        if (Object.keys(expressionAttributeNames).length > 0) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        const result = await ddbDocClient.send(new QueryCommand(params));

        return successResponse(result.Items);
    } catch (err) {
        console.error('Error retrieving records:', err);
        return errorResponse(err.message || 'Failed to retrieve records');
    }
};
