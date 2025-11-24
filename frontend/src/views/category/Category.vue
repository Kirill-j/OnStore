<template>
  <div v-if="category">
    <v-card class="pa-4">
      <v-card-title>Категория</v-card-title>

      <v-card-text>
        <div v-if="!submitted">
          <v-form @submit.prevent="updateCategory">
            <v-text-field
              v-model="category.name"
              label="Наименование категории"
              required
              prepend-icon="mdi-tag"
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              class="mr-2"
            >
              Обновить
            </v-btn>

            <v-btn
              color="error"
              variant="outlined"
              @click="deleteCategory"
            >
              Удалить
            </v-btn>
          </v-form>
        </div>
        <div v-else>
          <v-alert type="success" class="mb-4">
            Вы успешно обновили запись.
          </v-alert>
          <v-btn
            to="/listCategories"
            tag="router-link"
            color="primary"
          >
            Вернуться к списку категорий
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <div v-else>
    <v-alert type="info" class="mt-4">
      Выберите категорию.
    </v-alert>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from "../../http-common"

export default defineComponent({
  name: "CategoryDetails",
  props: ['id'],
  setup(props) {
    const category = ref(null)
    const submitted = ref(false)
    const router = useRouter()

    const getCategory = () => {
      http
        .get("/category/" + props.id)
        .then(response => {
          category.value = response.data
        })
        .catch(e => {
          console.log(e)
        })
    }

    const updateCategory = () => {
      const data = {
        name: category.value.name
      }

      http
        .post("/updateCategory/" + category.value.id, data)
        .then(() => {
          router.push('/listCategories')
        })
        .catch(e => {
          console.log(e)
        })

      submitted.value = true
    }

    const deleteCategory = () => {
      http
        .post("/deleteCategory/" + category.value.id)
        .then(() => {
          router.push('/listCategories')
        })
        .catch(e => {
          console.log(e)
        })
    }

    onMounted(() => {
      getCategory()
    })

    return {
      category,
      submitted,
      updateCategory,
      deleteCategory
    }
  }
})
</script>
