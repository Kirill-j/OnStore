module.exports = (app) => {

    const category = require('../controller/category.controller.js');

    var { authJwt } = require("../middleware");

    // Получение всех категорий
    // GET http://localhost:3000/api/categories
    app.get('/api/categories', [authJwt.verifyToken], category.findAll);

    // Добавление категории
    // POST http://localhost:3000/api/addCategory
    app.post('/api/addCategory', category.create);

    // Обновление категории по id
    // POST http://localhost:3000/api/updateCategory/1
    app.post('/api/updateCategory/:id', category.update);

    // Удаление категории по id
    // POST http://localhost:3000/api/deleteCategory/1
    app.post('/api/deleteCategory/:id', category.delete);

    // Получение категории по id
    // GET http://localhost:3000/api/category/1
    app.get('/api/category/:id', category.findById);

    // Получение категории по name
    // GET http://localhost:3000/api/category/name/Кроссовки
    app.get('/api/category/name/:name', category.findByName);
};