function sendResult(res, result) {
    res.status(200).send(result);
}

function sendError(res, err) {
    console.error(err); // заодно логируем ошибку в консоль сервера
    res.status(500).send(err);
}

module.exports = {
    sendResult: sendResult,
    sendError: sendError
};