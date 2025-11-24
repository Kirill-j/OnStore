var dbProperties = {
    database: 'onstore',   // база данных
    username: 'root',      // стандартный пользователь Wamp/MySQL
    password: '',          // по умолчанию пустой
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

var Sequelize = require('sequelize');
var sequelize = new Sequelize(
    dbProperties.database,
    dbProperties.username,
    dbProperties.password,
    {
        host: dbProperties.host,
        dialect: dbProperties.dialect,
        pool: dbProperties.pool,
        define: {
            // имена таблиц НЕ делаем во множественном числе
            freezeTableName: true,

            // НЕ создаём автоматически createdAt/updatedAt
            timestamps: false
        }
    }
);

var db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Подключаем модели (пока файлы есть, но пустые/частично пустые)
db.category = require('../model/category.model')(sequelize, Sequelize);
db.product  = require('../model/product.model')(sequelize, Sequelize);
db.cart     = require('../model/cart.model')(sequelize, Sequelize);
db.user     = require('../model/user.model')(sequelize, Sequelize);
db.wishlist = require('../model/wishlist.model')(sequelize, Sequelize);

// Пробегаем по моделям и вызываем associate, чтобы установить связи
Object.keys(db).forEach(modelName => {
    if (db[modelName] && db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;