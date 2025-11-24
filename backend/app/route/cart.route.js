module.exports = (app) => {

    const cart = require('../controller/cart.controller');

    // Получить корзину по id пользователя
    app.get('/api/getCart/:id', cart.getCart);

    // Добавить товар в корзину
    app.post('/api/addProductToCart', cart.addProductToCart);

    // Удалить / уменьшить товар из корзины
    app.post('/api/deleteProductFromCart', cart.deleteProductFromCart);

    app.post('/api/checkout', cart.checkout);
};
