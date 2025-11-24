var db = require('../config/db.config.js');
var Product = db.product;
var Category = db.category;
var globalFunctions = require('../config/global.functions.js');
var multiparty = require('multiparty');
var fs = require('fs');
var uuid = require('uuid');

// =======================
// 1. Получение списка товаров
// GET /api/listProducts
// с подгрузкой категории (INNER JOIN)
// =======================
exports.listProducts = (req, res) => {
    Product.findAll({
        include: [
            {
                model: Category,
                required: true, 
            }
        ]
    })
        .then(objects => {
            // добавляем адрес сервера к каждому изображению
            const updatedObjects = objects.map(object => {
                if (object.url_image) { // Проверяем, есть ли изображение
                    object.url_image = `${process.env.BASE_URL}/${object.url_image}`; // Формируем полный URL
                }
                return object;
            });
            // возврат найденных записей
            globalFunctions.sendResult(res, updatedObjects);
        }).catch(err => {
        // возврат найденной ошибки
        globalFunctions.sendError(res, err);
    })
};

// =======================
// 2. Добавление товара
// POST /api/addProduct
// body: { name, price, description, category_id, count, url_image }
// =======================
exports.create = async (req, res) => {
    // создаём объект для чтения данных, переданных со стороны клиента (передавали объект FormData)
    var form = new multiparty.Form();

    // читаем данные
    await form.parse(req, async (err, fields, files) => {
        try {
            var mimeType = files.image[0].headers['content-type']; // тип файла указывается так: image/png
            expansion = mimeType.split('/')[1]; // из "image/png" нужно извлечь только расширение

            var newName = uuid.v4() + "." + expansion; // вызываем функцию v4() для того, чтобы уникальный идентификатор был сгенерирован случайным образом
            var link = './files/' + newName;

            fs.copyFile(files.image[0].path, link, (err) => {
                if (err) {
                    globalFunctions.sendError(res, err);
                }
                fs.unlink(files.image[0].path, (err) => {
                    if (err) {
                        globalFunctions.sendError(res, err);
                    }
                });
            });
            
            Product.create({
                name: fields.name[0],
                price:  fields.price[0],
                description: fields.description[0],
                category_id: fields.category_id[0],
                count: fields.count[0],
                url_image: newName,
            }).then(object => {
                globalFunctions.sendResult(res, object);
            }).catch(err => {
                globalFunctions.sendError(res, err);
            })
        } catch (err) {
            globalFunctions.sendError(res, err);
        }
    });
};

// =======================
// 3. Обновление товара по id
// POST /api/updateProduct/:id
// body: те же поля, что и при создании
// =======================
exports.update = async (req, res) => {
    const form = new multiparty.Form();

    await form.parse(req, async (err, fields, files) => {
        if (err) {
            return globalFunctions.sendError(res, err);
        }

        const productId = req.params.id;
        let oldImageName = null;

        try {
            // получаем данные о товаре
            const product = await Product.findByPk(productId);
            if (!product) {
                return globalFunctions.sendError(res, { message: 'Товар не найден' });
            }

            oldImageName = product.url_image; // имя старого изображения

            // если новое изображение загружено
            if (files.image && files.image.length > 0) {
                const mimeType = files.image[0].headers['content-type'];
                const expansion = mimeType.split('/')[1];
                const newName = uuid.v4() + "." + expansion;
                var link = './files/' + newName;

                fs.copyFile(files.image[0].path, link, (err) => {
                    if (err) {
                        globalFunctions.sendError(res, err);
                    }
                    fs.unlink(files.image[0].path, (err) => {
                        if (err) {
                            globalFunctions.sendError(res, err);
                        }
                    });
                });

                // удаляем старое изображение с диска
                if (oldImageName) {
                    fs.unlink('./files/' + oldImageName, (err) => {
                        if (err) {
                            globalFunctions.sendError(res, err);
                        }
                    });
                }

                // обновляем запись в базе данных с новым именем изображения
                product.url_image = newName;
            }

            // обновляем остальные поля товара
            product.name = fields.name[0];
            product.price = parseFloat(fields.price[0]);
            product.description = fields.description[0];
            product.category_id = fields.category_id[0];
            product.count = fields.count[0];
            // сохраняем обновленный товар в базе данных
            await product.save();

            globalFunctions.sendResult(res, product);
        } catch (err) {
            globalFunctions.sendError(res, err);
        }
    });
};

// =======================
// 4. Удаление товара по id
// POST /api/deleteProduct/:id
// =======================
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        // 1. Находим товар
        const product = await Product.findByPk(id);

        if (!product) {
            return globalFunctions.sendError(res, { message: 'Товар не найден' });
        }

        const imageName = product.url_image; // тут просто имя файла, например "f2a1b0…c.png"

        // 2. Удаляем запись из БД
        await Product.destroy({
            where: { id: id }
        });

        // 3. Если у товара была картинка — пробуем удалить файл
        if (imageName) {
            const filePath = './files/' + imageName;

            fs.unlink(filePath, (err) => {
                // Если файла нет (ENOENT) — не считаем это критической ошибкой
                if (err && err.code !== 'ENOENT') {
                    console.error('Ошибка при удалении файла изображения:', err);
                }
            });
        }

        // 4. Возвращаем успешный ответ
        globalFunctions.sendResult(res, 'Товар и его изображение удалены');
    } catch (err) {
        globalFunctions.sendError(res, err);
    }
};

// =======================
// 5. Получение товара по id
// GET /api/product/:id
// с подгрузкой категории
// =======================
exports.findById = (req, res) => {
    Product.findByPk(req.params.id, {
        include: [
            {
                model: Category,
                required: true,
            }
        ]
    }
        )
        .then(object => {
            object.url_image = `${process.env.BASE_URL}/${object.url_image}`; // формируем полный URL
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};