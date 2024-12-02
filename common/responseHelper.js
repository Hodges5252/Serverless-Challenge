module.exports.successResponse = (data) => ({
    statusCode: 200,
    body: JSON.stringify(data),
});

module.exports.errorResponse = (message, statusCode = 500) => ({
    statusCode,
    body: JSON.stringify({ error: message }),
});