const { ddbDocClient, QueryCommand } = require('../common/dynamoClient');
const { successResponse, errorResponse } = require('../common/responseHelper');

module.exports = async (event) => {
    try {
        const { budgetId, startDate, endDate } = event.queryStringParameters || {};

        if (!budgetId) {
            return errorResponse('budgetId is required');
        }

        const expressionAttributeValues = { ':budgetId': budgetId };
        let keyConditionExpression = 'budgetId = :budgetId';

        const filterExpressions = [];
        if (startDate) {
            filterExpressions.push('#date >= :startDate');
            expressionAttributeValues[':startDate'] = startDate;
        }
        if (endDate) {
            filterExpressions.push('#date <= :endDate');
            expressionAttributeValues[':endDate'] = endDate;
        }

        const params = {
            TableName: process.env.RECORDS_TABLE,
            IndexName: 'BudgetIndex',
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ...(filterExpressions.length > 0 && { FilterExpression: filterExpressions.join(' AND ') }),
            ...(startDate || endDate ? { ExpressionAttributeNames: { '#date': 'date' } } : {}),
        };

        const result = await ddbDocClient.send(new QueryCommand(params));
        return successResponse(result.Items);
    } catch (err) {
        console.error('Error retrieving records:', err);
        return errorResponse(err.message || 'Failed to retrieve records');
    }
};
