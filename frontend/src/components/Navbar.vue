<template>
  <v-app-bar color="indigo" dark flat>
    <v-app-bar-title>OnStore</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn variant="text" to="/listCategories" tag="router-link">
      Категории
    </v-btn>

    <v-btn variant="text" to="/listProducts" tag="router-link">
      Товары
    </v-btn>

    <v-btn variant="text" to="/shop" tag="router-link">
      Магазин
    </v-btn>

    <div v-if="currentUser">
        <v-btn variant="text" to="/wishlist" tag="router-link">
          Избранное
        </v-btn>

      <v-btn to="/profile">
        <v-btn variant="text" class="mr-2">{{ currentUser.username }}</v-btn>
      </v-btn>
      <v-btn variant="outlined" @click.prevent="logOut">Выйти</v-btn>
    </div>
    <div v-else>
      <v-btn to="/login">
        <v-btn variant="outlined">Войти</v-btn>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "NavBar",
  setup() {
    const store = useStore();

    const currentUser = computed(() => store.state.auth.user);

    const logOut = () => {
      store.dispatch('auth/logout')
        .then(() => {
          window.location.href = '/login';
        })
        .catch(err => {
          console.error("Ошибка выхода:", err);
        });
    };

    return {
      currentUser,
      logOut
    };
  }
};
</script>

<style scoped>
</style>