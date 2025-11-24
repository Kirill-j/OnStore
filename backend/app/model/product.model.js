module.exports = (sequelize, Sequelize) => {
    var Product = sequelize.define(
        'product',   // таблица product
        {
            id: {
                type: Sequelize.INTEGER(10),
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            price: {
                type: Sequelize.FLOAT(10, 2),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT
            },
            category_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            count: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            url_image: {
                type: Sequelize.TEXT
            }
        }
    );

    Product.associate = (models) => {
        // product принадлежит одной категории
        Product.belongsTo(models.category, {
            foreignKey: 'category_id'
        });

        // один товар может быть в нескольких строках wishlist
        Product.hasMany(models.wishlist, {
            foreignKey: 'product_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // один товар может быть в нескольких строках cart
        Product.hasMany(models.cart, {
            foreignKey: 'product_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return Product;
};