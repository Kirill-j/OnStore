module.exports = (app) => {
    var { authJwt, verifySignUp } = require("../middleware");
    var auth = require("../controller/auth.controller");

    app.use((req, res, next) => {
        // заголовки для авторизации
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // регистрация пользователя с проверкой уникальности логина
    app.post("/api/register", [verifySignUp.checkDuplicateUsername], auth.register);

    // логин
    app.post("/api/login", auth.login);

    // обновление токена
    app.post("/api/refreshToken", auth.refreshToken);

    // проверка, что пользователь авторизован
    app.get("/api/userBoard", [authJwt.verifyToken], auth.userBoard);
};
