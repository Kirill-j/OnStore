module.exports = (app) => {

    const product = require('../controller/product.controller.js');

    // Получение списка товаров
    // GET http://localhost:3000/api/listProducts
    app.get('/api/listProducts', product.listProducts);

    // Добавление товара
    // POST http://localhost:3000/api/addProduct
    app.post('/api/addProduct', product.create);

    // Обновление товара по id
    // POST http://localhost:3000/api/updateProduct/:id
    app.post('/api/updateProduct/:id', product.update);

    // Удаление товара по id
    // POST http://localhost:3000/api/deleteProduct/:id
    app.post('/api/deleteProduct/:id', product.delete);

    // Получение товара по id
    // GET http://localhost:3000/api/product/:id
    app.get('/api/product/:id', product.findById);
};