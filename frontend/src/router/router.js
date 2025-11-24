import { createWebHistory, createRouter } from "vue-router";
import store from "../store/index";

// определяем маршруты
const routes = [
    {
        path: "/listCategories",                 // URL
        name: "categories",                     // имя маршрута
        alias: "/categories",                   // дополнительный путь
        component: () => import('../views/category/ListCategories.vue'),
        meta: {
            title: "Список категорий"
        }
    },
    {
        path: "/category/:id",
        name: "category-details",
        component: () => import('../views/category/Category.vue'),
        props: true,                            // можно принимать :id как пропс
        meta: {
            title: "Данные категорий"
        }
    },
    {
        path: "/addCategory",
        name: "add-category",
        component: () => import('../views/category/AddCategory.vue'),
        meta: {
            title: "Добавление категории"
        }
    },
    {
        path: "/searchCategories",
        name: "search-categories",
        component: () => import('../views/category/SearchCategories.vue'),
        meta: {
            title: "Поиск категорий"
        }
    },
    {
        path: "/login",
        name: "login-user",
        component: import('../views/authorization/Login.vue'),
        meta: {
            title: "Вход в систему"
        }
    },
    {
        path: "/register",
        name: "register-user",
        component: import('../views/authorization/Register.vue'),
        meta: {
            title: "Регистрация"
        }
    },
    {
        path: "/profile",
        name: "profile-user",
        component: import('../views/authorization/Profile.vue'),
        meta: {
            title: "Профиль пользователя",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
            requiredAuth: true
        }
    },
     {
        path: "/listProducts",
        name: "products",
        alias: "/products", 
        component: () => import('../views/product/ListProducts.vue'),
        meta: {
            title: "Список товаров"
        }
    },
    {
        path: "/addProduct",
        name: "add-product",
        component: () => import('../views/product/AddProduct.vue'),
        meta: {
            title: "Добавление товара"
        }
    },
    {
        path: "/product/:id",
        name: "product-details",
        component: () => import('../views/product/Product.vue'),
        props: true,
        meta: {
            title: "Данные товара"
        }
    },
    {
        path: "/shop",
        name: "select-products",
        component: () => import('../views/cart/SelectProducts.vue'),
        meta: {
            title: "Товары и корзина"
        }
    },
    {
        path: "/wishlist",
        name: "wishlist",
        component: () => import('../views/wishlist/Wishlist.vue'),
        meta: {
            title: "Избранное",
            requiredAuth: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(),  // HTML5 история
    routes,
});

// заголовок окна (title) из meta
router.beforeEach(async (to, from, next) => {
  // заголовок страницы
  document.title = to.meta.title || "Главная страница";

  // проверяем наличие токена и срок его действия
  const isTokenActive = await store.getters["auth/isTokenActive"];

  // если токен живой — всё ок
  if (isTokenActive) {
    return next();
  }

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  if (user) {
    try {
      // пробуем обновить токен
      await store.dispatch("auth/refreshToken", user);
      return next();
    } catch (err) {
      console.error("Ошибка обновления токена:", err);
      localStorage.removeItem("user");
      return next({ path: "/login" });
    }
  } else {
    // токена нет
    localStorage.removeItem("user");

    if (to.meta.requiredAuth) {
      return next({ path: "/login" });
    }
  }

  return next();
});

export default router;