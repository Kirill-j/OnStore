import http from "../http-common";

function getUserBoard() {
    // проверяем, авторизован ли пользователь
    return http.get("/userBoard");
}

export default {
    getUserBoard
};
