
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cors = require('cors');

var corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

// Указание, что каталог files используется для хранения статических файлов
app.use(express.static("files"));

// подключение переменных окружения
require('dotenv').config()

// Парсим JSON и формы
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Подключаем БД и модели
var db = require('./app/config/db.config.js');

// ВАЖНО: первый запуск — force: true (создаём таблицы с нуля)
db.sequelize.sync({ force: false })

// Подключение маршрутов категорий
var categoryRoutes = require('./app/route/category.route.js');
categoryRoutes(app);

// Подключаем маршруты товаров
var productRoutes = require('./app/route/product.route.js');
productRoutes(app);

var cart = require('./app/route/cart.route.js');
cart(app);

var wishlist = require('./app/route/wishlist.route.js');
wishlist(app);

var auth = require('./app/route/auth.route.js');
auth(app);

// Пока без маршрутов, просто слушаем порт
app.listen(3000);