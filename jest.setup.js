const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoDbMock = mockClient(DynamoDBDocumentClient);

// Generic mocks for common scenarios
dynamoDbMock.on(PutCommand).resolves({});
dynamoDbMock.on(DeleteCommand).resolves({});
dynamoDbMock.on(GetCommand).resolves({});
dynamoDbMock.on(UpdateCommand).resolves({});

// Test helper to create a budget
const createTestBudget = async (budgetId, categories) => {
    const budget = {
        budgetId,
        categories,
        createdAt: new Date().toISOString(),
    };

    // Mock the specific PutCommand for this budget
    dynamoDbMock.on(PutCommand, {
        TableName: process.env.BUDGET_TABLE,
        Item: budget,
    }).resolves({});

    return budget;
};

// Test helper to delete a budget
const deleteTestBudget = async (budgetId) => {
    // Mock the specific DeleteCommand for this budget
    dynamoDbMock.on(DeleteCommand, {
        TableName: process.env.BUDGET_TABLE,
        Key: { budgetId },
    }).resolves({});
};

// Test helper to create a record
const createTestRecord = async (recordId, budgetId, amount, date) => {
    const record = {
        recordId,
        budgetId,
        amount,
        date: date || new Date().toISOString(),
        categoryAllocations: {}, // Mocked allocation logic
    };

    // Mock the specific PutCommand for this record
    dynamoDbMock.on(PutCommand, {
        TableName: process.env.RECORDS_TABLE,
        Item: record,
    }).resolves({});

    return record;
};

// Test helper to delete a record
const deleteTestRecord = async (recordId) => {
    // Mock the specific DeleteCommand for this record
    dynamoDbMock.on(DeleteCommand, {
        TableName: process.env.RECORDS_TABLE,
        Key: { recordId },
    }).resolves({});
};

module.exports = {
    dynamoDbMock,
    createTestBudget,
    deleteTestBudget,
    createTestRecord,
    deleteTestRecord,
};
