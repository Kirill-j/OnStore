module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define(
        'user',   // таблица user
        {
            id: {
                type: Sequelize.INTEGER(10),
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM,
                values: ['Администратор', 'Покупатель', 'Продавец'],
                allowNull: false
            },
            firstname: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            lastname: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            middlename: {
                type: Sequelize.STRING(20)
            }
        }
    );

    User.associate = (models) => {
        // один пользователь -> много записей в корзине
        User.hasMany(models.cart, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // один пользователь -> много записей в wishlist
        User.hasMany(models.wishlist, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return User;
};