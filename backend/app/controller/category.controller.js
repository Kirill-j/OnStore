var db = require('../config/db.config.js');      // подключаем БД и модели
var Category = db.category;                      // модель category
var globalFunctions = require('../config/global.functions.js');

// =======================
// Получение всех категорий
// GET /api/categories
// =======================
exports.findAll = (req, res) => {
    Category.findAll()
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// =======================
// Добавление категории
// POST /api/addCategory
// body: { name: "Кроссовки" }
// =======================
exports.create = (req, res) => {
    Category.create({
        name: req.body.name
    })
        .then(object => {
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// =======================
// Обновление категории по id
// POST /api/updateCategory/:id
// body: { name: "Новая категория" }
// =======================
exports.update = (req, res) => {
    Category.update(
        {
            name: req.body.name
        },
        {
            where: { id: req.params.id }
        }
    )
        .then(result => {
            // result = [кол-во обновлённых строк]
            globalFunctions.sendResult(res, result);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// =======================
// Удаление категории по id
// POST /api/deleteCategory/:id
// =======================
exports.delete = (req, res) => {
    Category.destroy({
        where: { id: req.params.id }
    })
        .then(() => {
            globalFunctions.sendResult(res, 'Запись удалена');
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// =======================
// Получение категории по id
// GET /api/category/:id
// =======================
exports.findById = (req, res) => {
    Category.findByPk(req.params.id)
        .then(object => {
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// =======================
// Получение категории по name
// GET /api/category/name/:name
// =======================
exports.findByName = (req, res) => {
    Category.findAll({
        where: { name: req.params.name }
    })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};