<template>
  <div class="container mt-3">
    <div class="row">
      <!-- слева каталог -->
      <ProductsForSale />
      <!-- справа плавающая корзина -->
      <Cart />
    </div>
  </div>
</template>

<script setup>
import ProductsForSale from './ProductsForSale.vue';
import Cart from './Cart.vue';
</script>
