<template>
  <v-card class="pa-4">
    <v-card-title>Добавление категории</v-card-title>

    <v-card-text>
      <div v-if="!submitted">
        <v-form @submit.prevent="addCategory">
          <v-text-field
            v-model="category.name"
            label="Наименование категории"
            required
            prepend-icon="mdi-tag"
          ></v-text-field>

          <v-btn
            type="submit"
            color="primary"
            class="mt-2"
          >
            Добавить
          </v-btn>
        </v-form>
      </div>
      <div v-else>
        <v-alert type="success" class="mb-4">
          Вы успешно добавили запись.
        </v-alert>
        <v-btn color="primary" class="mr-2" @click="newCategory">
          Добавить новую категорию
        </v-btn>
        <v-btn
          variant="outlined"
          to="/listCategories"
          tag="router-link"
        >
          Вернуться к списку категорий
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent, ref } from 'vue'
import http from "../../http-common"

export default defineComponent({
  name: "AddCategory",
  setup() {
    const category = ref({
      name: ""
    })
    const submitted = ref(false)

    const addCategory = () => {
      const data = {
        name: category.value.name
      }

      http
        .post("/addCategory", data)
        .then(response => {
          category.value.id = response.data.id
          submitted.value = true
        })
        .catch(e => {
          console.log(e)
        })
    }

    const newCategory = () => {
      submitted.value = false
      category.value = { name: "" }
    }

    return {
      category,
      submitted,
      addCategory,
      newCategory
    }
  }
})
</script>
