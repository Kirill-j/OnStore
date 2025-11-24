var db = require('../config/db.config.js');
var Cart = db.cart;
var Product = db.product;
var globalFunctions = require('../config/global.functions.js');

const { Op, fn, col } = require('sequelize');

// Получаем все товары пользователя из корзины
// (берём только записи, где price = null — ещё не оформленные заказы)
exports.getCart = (req, res) => {
    Cart.findAll({
        where: {
            price: 0,
            user_id: req.params.id
        },
        include: [
            {
                model: Product,
                required: true
            }
        ],
        group: ['product_id', 'user_id', 'product.id'], // на всякий случай добавляем product.id в group
        attributes: {
            include: [
                [fn('SUM', col('cart.count')), 'count'] // суммарное количество по товару
            ]
        },
    })
        .then(objects => {
            console.log(objects);
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// Добавление товара в корзину
exports.addProductToCart = async (req, res) => {
    try {
        // Ищем, есть ли такой товар у пользователя в "активной" корзине
        const existingCart = await Cart.findOne({
            where: {
                user_id: req.body.user_id,
                product_id: req.body.product_id,
                price: 0
            }
        });

        console.log('existingCart', existingCart);

        if (existingCart) {
            // Увеличиваем количество на 1
            existingCart.count = existingCart.dataValues.count + 1;
            await existingCart.save();
        } else {
            // Добавляем новую запись
            await Cart.create({
                user_id: req.body.user_id,
                product_id: req.body.product_id,
                count: 1,
                price: 0
            });
        }

        globalFunctions.sendResult(res, "Товар успешно добавлен");
    } catch (err) {
        globalFunctions.sendError(res, err);
    }
};

// Удаление товара из корзины (по одному)
exports.deleteProductFromCart = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        console.log('delete body', req.body);

        // Ищем товар в корзине
        let existingCart = await Cart.findOne({
            where: {
                user_id: user_id,
                product_id: product_id,
                price: 0
            }
        });

        console.log('existingCart', existingCart);

        if (!existingCart) {
            return globalFunctions.sendError(res, "Товар не найден в корзине");
        }

        if (existingCart.count > 1) {
            existingCart.count--;
            await existingCart.save();
            globalFunctions.sendResult(res, "Количество товара уменьшено на 1");
        } else {
            await Cart.destroy({ where: { id: existingCart.id } });
            globalFunctions.sendResult(res, "Товар успешно удалён из корзины");
        }
    } catch (err) {
        globalFunctions.sendError(res, err);
    }
};

// Оформление заказа: всем товарам пользователя в корзине выставляем price
// POST /api/checkout
exports.checkout = async (req, res) => {
    const userId = req.body.user_id;

    try {
        // Берём все позиции пользователя, которые ещё НЕ оформлены (price = null)
        const cartItems = await Cart.findAll({
            where: {
                user_id: userId,
                price: null
            },
            include: [
                {
                    model: Product,
                    required: true
                }
            ]
        });

        if (!cartItems || cartItems.length === 0) {
            return globalFunctions.sendError(res, "Корзина пуста или все товары уже оформлены");
        }

        // Для каждой позиции фиксируем цену товара на момент оформления заказа
        for (const cartItem of cartItems) {
            cartItem.price = cartItem.product.price; // цена за единицу товара
            await cartItem.save();
        }

        // После этого getCart больше их не вернёт (он берёт только price = null)
        globalFunctions.sendResult(res, "Заказ успешно оформлен");
    } catch (err) {
        globalFunctions.sendError(res, err);
    }
};