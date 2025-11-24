<template>
    <div class="container mt-3">
      <div class="row">
        <div class="col">
          <router-link to="/addProduct" class="btn btn-success mb-3">Добавить товар</router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Параметры поиска</h5>
              <select class="form-control" v-model="filterCategoryId">
                <option value="">Выберите категорию</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
              <div class="input-group mt-3">
                <input
                  type="number"
                  placeholder="Минимальная цена"
                  v-model.number="minPrice"
                  class="form-control"
                />
                <span class="input-group-text">руб.</span>
              </div>
              <div class="input-group mt-3">
                <input
                  type="number"
                  placeholder="Максимальная цена"
                  v-model.number="maxPrice"
                  class="form-control"
                />
                <span class="input-group-text">руб.</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <!-- Сетка товаров -->
          <div v-if="filteredProducts.length" class="products-grid">
            <div
              class="product-card"
              v-for="product in filteredProducts"
              :key="product.id"
            >
              <div class="product-image-wrapper" v-if="product.url_image">
                <router-link :to="`/product/${product.id}`">
                  <img
                    :src="product.url_image"
                    :alt="product.name"
                    class="product-image"
                  />
                </router-link>
              </div>

              <h5 class="product-title">
                <router-link :to="`/product/${product.id}`">
                  {{ product.name }}
                </router-link>
              </h5>

              <div class="product-info">
                Категория: {{ product.category ? product.category.name : 'Не указана' }}
              </div>
              <div class="product-info">Цена: {{ product.price }}</div>
              <div class="product-info">Количество: {{ product.count }}</div>
              <div class="product-info">Описание: {{ product.description }}</div>
            </div>
          </div>

          <!-- Если товаров нет -->
          <div v-else class="no-products">
            <div class="alert alert-info">Товары не найдены</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import http from "../../http-common";
  
  export default defineComponent({
    name: "ListProducts",
    setup() {
      const products = ref([]);
      const filteredProducts = ref([]);
      const filterCategoryId = ref('');
      const minPrice = ref('');
      const maxPrice = ref('');
      const categories = ref([]);
  
      const getProducts = async () => {
        try {
          const response = await http.get("/listProducts");
          products.value = response.data;
          filteredProducts.value = response.data;
        } catch (e) {
          console.log(e);
        }
      };
  
      const getCategories = async () => {
        try {
          const response = await http.get("/categories");
          categories.value = response.data;
        } catch (error) {
          console.log(e);
        }
      };
  
      const applyFilters = () => {
        let results = products.value;
  
        if (filterCategoryId.value) {
          results = results.filter(product => product.category_id === parseInt(filterCategoryId.value));
        }
  
        if (minPrice.value) {
          results = results.filter(product => product.price >= parseFloat(minPrice.value));
        }
  
        if (maxPrice.value) {
          results = results.filter(product => product.price <= parseFloat(maxPrice.value));
        }
  
        filteredProducts.value = results;
      };
  
      onMounted(() => {
        getProducts();
        getCategories();
      });
  
      watch([filterCategoryId, minPrice, maxPrice], applyFilters);
  
      return {
        products,
        filteredProducts,
        filterCategoryId,
        minPrice,
        maxPrice,
        categories
      };
    }
  });
  </script>
  
  <style scoped>
  .container-md {
    max-width: 960px;
  }
  
  .card {
    margin-bottom: 20px;
  }
  
  .input-group {
    display: flex;
  }
  
  .input-group .form-control {
    flex-grow: 1;
  }
  
  .input-group .input-group-text {
    display: flex;
    align-items: center;
  }

  .products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 10px;
}

.product-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-image-wrapper {
  width: 100%;
  height: 230px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-title {
  font-size: 18px;
  font-weight: 600;
  margin: 4px 0 6px;
}

.product-title a {
  text-decoration: none;
}

.product-info {
  font-size: 14px;
  margin-top: 2px;
}

.no-products {
  margin-top: 20px;
}
  </style>