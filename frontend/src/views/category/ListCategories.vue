<template>
  <div>
    <v-card class="pa-4">
      <v-card-title>
        Список категорий
      </v-card-title>

      <v-card-subtitle>
        Управление категориями товаров
      </v-card-subtitle>

      <v-card-actions class="mb-2" style="gap: 8px;">
        <!-- Добавить категорию — только авторизованным -->
        <div v-if="displayContent">
          <v-btn
            color="primary"
            class="mr-2"
            to="/addCategory"
            tag="router-link"
          >
            Добавить категорию
          </v-btn>
        </div>
        <div v-else>
          <v-alert
            type="warning"
            variant="tonal"
            density="compact"
          >
            Добавление доступно только авторизованным пользователям
          </v-alert>
        </div>

        <!-- Поиск категории — всем -->
        <v-btn
          color="secondary"
          variant="outlined"
          to="/searchCategories"
          tag="router-link"
        >
          Поиск категории
        </v-btn>
      </v-card-actions>

      <v-divider class="mb-2"></v-divider>

      <!-- Список категорий виден ВСЕМ -->
      <v-list v-if="categories.length">
        <v-list-item
          v-for="(category, index) in categories"
          :key="index"
          :to="{
            name: 'category-details',
            params: { id: category.id }
          }"
          tag="router-link"
        >
          <v-list-item-title>{{ category.name }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-alert
        v-else
        type="info"
        variant="tonal"
        class="mt-2"
      >
        Категории пока не добавлены.
      </v-alert>
    </v-card>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import http from "../../http-common";
import UserService from '../../services/user.service';

export default defineComponent({
  name: "ListCategories",
  setup() {
    const categories = ref([]);
    const displayContent = ref(false);

    const getCategories = () => {
      http
        .get("/categories")
        .then(response => {
          console.log(response.data);
          categories.value = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    onMounted(() => {
      UserService.getUserBoard()
        .then(() => {
          displayContent.value = true;
        })
        .catch(e => {
          console.error(
            (e.response && e.response.data) || e.message || e.toString()
          );
        });

      getCategories();
    });

    return {
      categories,
      displayContent,
      getCategories
    };
  }
});
</script>