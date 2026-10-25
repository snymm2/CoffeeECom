function sendError(res, status, message, details) {
    const response = { error: message }

    if (details) {
        response.details = details;
    }

    return res.status(status).json(response);
}

module.exports = sendError;