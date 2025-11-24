import http from "../http-common";

// отправка данных на сторону сервера для того, чтобы пользователь мог авторизоваться в системе
function login(user) {
    var data = {
        username: user.username,
        password: user.password
    };
    return http
        .post("/login", data)
        .then(response => {
            if (response.data.accessToken) {
                // записываем данные пользователя в локальное хранилище браузера
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
}

// обработка выхода пользователя
function logout() {
    // при нажатии "Выйти" удаляем данные пользователя
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExp');
}

// обработка регистрации пользователя
function register(user) {
    var data = {
        username: user.username,
        password: user.password,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename
    };
    console.log(data);
    return http.post("/register", data);
}

// обновление токена (если срок действия истёк/истекает)
function refreshToken(user) {
    var data = {
        username: user.username
    };
    return http
        .post("/refreshToken", data)
        .then(response => {
            if (response.data.accessToken) {
                console.log(response.data.accessToken);
                // переписываем user в localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            const userLocal = JSON.parse(localStorage.getItem("user"));
            console.log(userLocal);
            return response.data;
        });
}

// декодируем JWT, чтобы получить время истечения exp
function jwtDecrypt(token) {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
}

// проверяем срок действия токена
function tokenAlive(exp) {
    // exp — секунды UNIX, Date.now() — миллисекунды
    if (Date.now() >= exp * 1000) {
        return false;
    }
    return true;
}

export default {
    login,
    logout,
    register,
    refreshToken,
    jwtDecrypt,
    tokenAlive
};
