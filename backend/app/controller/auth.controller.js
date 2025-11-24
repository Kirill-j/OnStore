var db = require("../config/db.config");
var config = require("../config/auth.config");
var User = db.user;
var globalFunctions = require('../config/global.functions.js');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// регистрация пользователя с учётом ролей
exports.register = async (req, res) => {
    const { username, password, role, firstname, lastname, middlename } = req.body;
    const token = req.headers["x-access-token"]; // токен, если пользователь авторизован

    try {
        // 1) Регистрация ПОКУПАТЕЛЯ
        if (role === 'Покупатель') {
            // покупателя может регать только НЕавторизованный пользователь
            if (token) {
                return res.status(403).send({
                    message: "Регистрация покупателей доступна только неавторизованным пользователям"
                });
            }
            // если токена нет — гость, можно регистрировать покупателя
        }

        // 2) Регистрация АДМИНА или ПРОДАВЦА
        else if (role === 'Администратор' || role === 'Продавец') {
            // обязательно должен быть токен
            if (!token) {
                return res.status(403).send({
                    message: "Только авторизованный администратор может регистрировать администраторов и продавцов"
                });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, config.secret); // проверяем токен
            } catch (err) {
                return res.status(401).send({
                    message: "Недействительный токен"
                });
            }

            const currentUser = await User.findByPk(decoded.id);

            if (!currentUser || currentUser.role !== 'Администратор') {
                return res.status(403).send({
                    message: "Недостаточно прав для регистрации администратора или продавца"
                });
            }
            // если дошли до сюда — текущий пользователь админ, можно регать
        }

        // 3) Любая другая роль — ошибка
        else {
            return res.status(400).send({
                message: "Недопустимая роль пользователя"
            });
        }

        // 4) Если все проверки прошли — создаём пользователя
        await User.create({
            username: username,
            password: bcrypt.hashSync(password, 10),
            role: role,
            firstname: firstname,
            lastname: lastname,
            middlename: middlename
        });

        const result = {
            message: "Пользователь зарегистрирован"
        };
        globalFunctions.sendResult(res, result);

    } catch (err) {
        globalFunctions.sendError(res, err);
    }
};

// проверка данных пользователя (логин)
exports.login = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if (!user) {
                res.status(404).send({ message: "Неверно введенный логин и/или пароль" });
                return;
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                res.status(401).send({
                    accessToken: null,
                    message: "Неверно введенный логин и/или пароль"
                });
                return;
            }

            // создаём JWT токен
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: "1h" // 1 час
            });

            console.log("Токен при авторизации");
            console.log(token);

            var object = {
                id: user.id,
                username: user.username,
                role: user.role,
                firstname: user.firstname,
                lastname: user.lastname,
                middlename: user.middlename,
                accessToken: token
            };
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// обновление токена (когда срок действия текущего истекает)
exports.refreshToken = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if (!user) {
                globalFunctions.sendError(res, "Неверно введенный логин и/или пароль");
                return;
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: "1h"
            });

            console.log("Новый токен");
            console.log(token);

            var object = {
                id: user.id,
                username: user.username,
                role: user.role,
                firstname: user.firstname,
                lastname: user.lastname,
                middlename: user.middlename,
                accessToken: token
            };
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// проверка, что пользователь авторизован
exports.userBoard = (req, res) => {
    globalFunctions.sendResult(res, "Пользователь авторизован");
};
