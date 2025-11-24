module.exports = (sequelize, Sequelize) => {
    var Wishlist = sequelize.define(
        'wishlist',   // таблица wishlist
        {
            user_id: {
                type: Sequelize.INTEGER(10),
                primaryKey: true,
                allowNull: false
            },
            product_id: {
                type: Sequelize.INTEGER(10),
                primaryKey: true,
                allowNull: false
            },
            comment: {
                type: Sequelize.TEXT
            }
        }
    );

    Wishlist.associate = (models) => {
        // строка вишлиста относится к одному товару
        Wishlist.belongsTo(models.product, {
            foreignKey: 'product_id'
        });

        // и одному пользователю
        Wishlist.belongsTo(models.user, {
            foreignKey: 'user_id'
        });
    };

    return Wishlist;
};