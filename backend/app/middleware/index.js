var authJwt = require("./authJwt");
var verifySignUp = require("./verifySignUp");

// делаем функциональность authJwt и verifySignUp доступной для роутов
module.exports = {
    authJwt,
    verifySignUp
};