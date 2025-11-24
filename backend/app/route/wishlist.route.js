module.exports = (app) => {
    const wishlist = require('../controller/wishlist.controller');

    // получить избранное пользователя
    app.get('/api/wishlist/:id', wishlist.getWishlist);

    // добавить в избранное
    app.post('/api/addToWishlist', wishlist.addToWishlist);

    // удалить из избранного
    app.post('/api/removeFromWishlist', wishlist.removeFromWishlist);
};
