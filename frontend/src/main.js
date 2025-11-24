import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'   // подключаем маршрутизацию
import './style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Иконки (опционально, но лучше сразу)
import '@mdi/font/css/materialdesignicons.css'

import store from './store'
// Bootstrap
import 'bootstrap/dist/css/bootstrap.css'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App);
app.use(router);
app.use(store);
app.use(vuetify)

let inactivityTime = null; // переменная для отслеживания времени бездействия
const inactivityLimit = 15 * 60 * 1000; // 15 минут

function handleInactivity() {
    clearTimeout(inactivityTime); // сбрасываем таймер
    inactivityTime = setTimeout(() => {
        localStorage.removeItem("user"); // удаляем пользователя из локального хранилища
        window.location.href = "/login"; // перенаправляем на страницу входа
    }, inactivityLimit); // выход пользователя через 15 минут бездействия
}

// при загрузке страницы
window.onload = handleInactivity;
// при движении мыши
document.onmousemove = handleInactivity;

app.mount('#app');