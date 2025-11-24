module.exports = (sequelize, Sequelize) => {
    var Category = sequelize.define(
        'category',       // имя таблицы в БД: category
        {
            id: {
                type: Sequelize.INTEGER(10),
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false
            }
        }
    );

    // Связь: одна категория -> много товаров (product)
    Category.associate = (models) => {
        Category.hasMany(models.product, {
            foreignKey: 'category_id', // FK в таблице product
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return Category;
};