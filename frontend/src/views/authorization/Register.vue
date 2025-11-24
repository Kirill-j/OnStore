<template>
  <div class="col-md-5 mx-auto mt-4">
    <h4 class="text-center">
      <!-- Заголовок меняем в зависимости от роли -->
      <span v-if="isAdmin">Регистрация сотрудника</span>
      <span v-else>Регистрация покупателя</span>
    </h4>

    <!-- Если авторизован, но не админ — нет доступа -->
    <div v-if="isLoggedIn && !isAdmin" class="mt-3">
      <div class="alert alert-danger" role="alert">
        У вас нет прав для регистрации пользователей.
      </div>
    </div>

    <!-- Основная форма регистрации -->
    <form
      v-else
      @submit.prevent="handleRegister"
      class="registration-form"
    >
      <div v-if="!successful">
        <div class="form-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Логин"
            v-model="user.username"
            required
          />
          <div v-if="usernameError" class="text-danger">
            {{ usernameError }}
          </div>
        </div>

        <div class="form-group mb-3">
          <input
            type="password"
            class="form-control"
            placeholder="Пароль"
            v-model="user.password"
            required
          />
          <div v-if="passwordError" class="text-danger">
            {{ passwordError }}
          </div>
        </div>

        <!-- Выбор роли:
             - если админ: можно выбрать Администратора или Продавца
             - если гость: скрываем селект, роль = Покупатель -->
        <div class="form-group mb-3" v-if="isAdmin">
          <select
            class="form-control"
            v-model="user.role"
            required
          >
            <option value="" disabled selected>Выберите роль</option>
            <option value="Администратор">Администратор</option>
            <option value="Продавец">Продавец</option>
          </select>
        </div>
        <div class="form-group mb-3" v-else>
          <!-- Просто текст, роль зафиксирована как Покупатель -->
          <input
            type="text"
            class="form-control"
            value="Покупатель"
            disabled
          />
        </div>

        <div class="form-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Фамилия"
            v-model="user.lastname"
            required
          />
        </div>

        <div class="form-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Имя"
            v-model="user.firstname"
            required
          />
        </div>

        <div class="form-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Отчество"
            v-model="user.middlename"
            required
          />
        </div>

        <div class="form-group text-center">
          <button class="btn btn-primary btn-block">
            Зарегистрировать
          </button>
        </div>
      </div>

      <div class="form-group">
        <div
          v-if="successMessage"
          class="alert alert-success"
          role="alert"
        >
          {{ successMessage }}
        </div>
      </div>

      <div class="form-group mt-2">
        <div
          v-if="errorMessage"
          class="alert alert-danger"
          role="alert"
        >
          {{ errorMessage }}
        </div>
      </div>
    </form>
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterUser',
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = ref({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      middlename: '',
      role: ''
    });

    const successful = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const usernameError = ref('');
    const passwordError = ref('');

    const currentUser = computed(() => store.state.auth.user);
    const isLoggedIn = computed(() => !!currentUser.value);
    const isAdmin = computed(
      () => currentUser.value && currentUser.value.role === 'Администратор'
    );

    // Валидация логина
    const validateUsername = (username) => {
      if (username.length < 3) {
        usernameError.value = 'Логин должен содержать как минимум 3 символа';
        return false;
      }
      usernameError.value = '';
      return true;
    };

    // Валидация пароля
    const validatePassword = (password) => {
      if (password.length < 4) {
        passwordError.value = 'Пароль должен содержать как минимум 4 символа';
        return false;
      }
      passwordError.value = '';
      return true;
    };

    const handleRegister = async () => {
      successMessage.value = '';
      errorMessage.value = '';

      if (
        !validateUsername(user.value.username) ||
        !validatePassword(user.value.password)
      ) {
        return;
      }

      // Логика ролей:
      // 1) Если пользователь не авторизован -> регистрируем ПРИМЕРНО только Покупателя
      if (!isLoggedIn.value) {
        user.value.role = 'Покупатель';
      }

      // 2) Если авторизован и админ — роль берём из select (Администратор/Продавец)
      if (isAdmin.value) {
        if (!user.value.role) {
          errorMessage.value = 'Выберите роль (Администратор или Продавец)';
          return;
        }
      }

      // 3) Если авторизован, но не админ — блокируем (на всякий случай)
      if (isLoggedIn.value && !isAdmin.value) {
        errorMessage.value = 'У вас нет прав для регистрации пользователей';
        return;
      }

      try {
        const data = await store.dispatch('auth/register', user.value);
        successMessage.value = data.message;
        successful.value = true;
      } catch (err) {
        console.error('REGISTER ERROR', err);
        errorMessage.value =
          (err.response && err.response.data && err.response.data.message) ||
          'Ошибка регистрации';
      }
    };

    // Если пользователь авторизован, но не админ — можно сразу увести со страницы (не обязательно)
    onMounted(() => {
      if (isLoggedIn.value && !isAdmin.value) {
        // Можно либо редирект, либо просто оставить сообщение на форме
        // router.push('/');
      }
    });

    return {
      user,
      successful,
      successMessage,
      errorMessage,
      usernameError,
      passwordError,
      handleRegister,
      isAdmin,
      isLoggedIn
    };
  }
};
</script>
