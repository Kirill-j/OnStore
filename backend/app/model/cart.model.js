module.exports = (sequelize, Sequelize) => {
    var Cart = sequelize.define(
        'cart',   // таблица cart
        {
            id: {
                type: Sequelize.INTEGER(10),
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            product_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            count: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            price: {
                type: Sequelize.FLOAT(10, 2),
                allowNull: false
            }
        }
    );

    Cart.associate = (models) => {
        // каждая строка корзины относится к одному пользователю
        Cart.belongsTo(models.user, {
            foreignKey: 'user_id'
        });

        // каждая строка корзины относится к одному товару
        Cart.belongsTo(models.product, {
            foreignKey: 'product_id'
        });
    };

    return Cart;
};