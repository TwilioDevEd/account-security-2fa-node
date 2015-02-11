// Generate error responses in a standard format
exports.error = function(response, code, message) {
    response.status(code).send({
        status: code,
        message: message
    });
};

// 200 OK empty response
exports.ok = function(response) {
    response.status(200).end();
};