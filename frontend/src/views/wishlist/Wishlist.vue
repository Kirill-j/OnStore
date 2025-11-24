<template>
  <div class="container mt-3">
    <h3>Избранные товары</h3>

    <div v-if="!currentUser">
      Для просмотра избранного необходимо <router-link to="/login">войти</router-link>.
    </div>

    <div v-else>
      <div class="row mt-3">
        <div v-if="!items.length" class="col">
          <div class="alert alert-info">Список избранного пуст.</div>
        </div>

        <div
          v-for="item in items"
          :key="item.product_id"
          class="col-md-4 mb-3"
        >
          <div class="card text-center" style="height: 280px;">
            <router-link
              :to="'/product/' + item.product.id"
              style="display: inline-block; height: 250px; overflow: hidden;"
            >
              <img
                v-if="item.product.url_image"
                :src="item.product.url_image.startsWith('http')
                        ? item.product.url_image
                        : (baseUrl + '/' + item.product.url_image)"
                alt="product"
                class="card-img-top"
                style="width: auto; height: 100%;"
              />
            </router-link>
            <div class="card-body">
              <h5 class="card-title">{{ item.product.name }}</h5>
              <div class="card-text">Цена: {{ item.product.price }}</div>
              <button
                class="btn btn-sm btn-danger mt-1"
                @click="handleRemove(item.product.id)"
              >
                Удалить из избранного
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const currentUser = computed(() => store.state.auth.user);
const userId = computed(() => currentUser.value ? currentUser.value.id : null);
const items = computed(() => store.state.wishlist.wishlistItems);

// если тебе нужно, можно взять baseUrl отсюда,
// но у тебя уже формируется полный url_image на бэке, так что можно и не использовать
const baseUrl = "http://localhost:3000";

const loadWishlist = () => {
  if (userId.value) {
    store.dispatch('getWishlist', userId.value);
  }
};

const handleRemove = (productId) => {
  if (!userId.value) return;
  store.dispatch('removeFromWishlist', { productId, userId: userId.value });
};

onMounted(() => {
  loadWishlist();
});
</script>