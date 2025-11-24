var db = require('../config/db.config.js');
var Wishlist = db.wishlist;
var Product = db.product;
var globalFunctions = require('../config/global.functions.js');

// Получить весь вишлист пользователя
// GET /api/wishlist/:id
exports.getWishlist = (req, res) => {
    Wishlist.findAll({
        where: {
            user_id: req.params.id
        },
        include: [
            {
                model: Product,
                required: true
            }
        ]
    })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// Добавить товар в избранное
// POST /api/addToWishlist
// body: { user_id, product_id, comment? }
exports.addToWishlist = async (req, res) => {
    try {
        const { user_id, product_id, comment } = req.body;

        // Проверяем, нет ли уже такого товара в избранном
        const existing = await Wishlist.findOne({
            where: { user_id, product_id }
        });

        if (existing) {
            return globalFunctions.sendResult(res, "Товар уже в избранном");
        }

        await Wishlist.create({
            user_id,
            product_id,
            comment: comment || null
        });

        globalFunctions.sendResult(res, "Товар добавлен в избранное");
    } catch (err) {
        globalFunctions.sendError(res, err);
    }
};

// Удалить товар из избранного
// POST /api/removeFromWishlist
// body: { user_id, product_id }
exports.removeFromWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        const deletedCount = await Wishlist.destroy({
            where: { user_id, product_id }
        });

        if (!deletedCount) {
            return globalFunctions.sendError(res, "Товар не найден в избранном");
        }

        globalFunctions.sendResult(res, "Товар удалён из избранного");
    } catch (err) {
        globalFunctions.sendError(res, err);
    }
};
