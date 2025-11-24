<template>
  <v-card class="pa-4">
    <v-card-title>Поиск категорий по названию</v-card-title>

    <v-card-text>
      <v-form @submit.prevent="searchCategoriesByName">
        <v-text-field
          v-model="name"
          label="Наименование категории"
          required
          prepend-icon="mdi-magnify"
        ></v-text-field>

        <v-btn type="submit" color="primary">
          Поиск
        </v-btn>
      </v-form>

      <v-divider class="my-4"></v-divider>

      <v-list class="search-result" v-if="categories.length">
        <v-list-item
          v-for="(category, index) in categories"
          :key="index"
        >
          <v-list-item-title>
            {{ category.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-alert
        v-else
        type="info"
        variant="tonal"
      >
        По вашему запросу ничего не найдено.
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent, ref } from 'vue'
import http from "../../http-common"

export default defineComponent({
  name: "SearchCategories",
  setup() {
    const name = ref("")
    const categories = ref([])

    const searchCategoriesByName = () => {
      http
        .get("/category/name/" + name.value)
        .then(response => {
          categories.value = response.data
        })
        .catch(e => {
          console.log(e)
        })
    }

    return {
      name,
      categories,
      searchCategoriesByName
    }
  }
})
</script>

<style scoped>
.search-result {
  padding: 0;
}
</style>
