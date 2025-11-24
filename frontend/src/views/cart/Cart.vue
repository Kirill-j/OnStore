<template>
  <div class="cart-container">
    <div class="cart-float">
      <h4>Корзина</h4>
      <ol>
        <li v-for="(items, productId) in groupedCartItems" :key="productId">
          <div class="cart-item">
            <div>
              <strong>{{ items[0].product.name }}</strong>
              &mdash; {{ items[0].product.price }} руб.
              &mdash; {{ items[0].count }} шт.
              <span class="close-icon" @click="handleRemoveFromCart(items[0].product.id)">×</span>
            </div>
          </div>
        </li>
      </ol>
      <div class="total-amount">
        Общая сумма: {{ totalAmount }} руб.
      </div>
      <button
        v-if="cartItems.length"
        class="btn btn-primary mt-2 w-100"
        @click="handleCheckout"
      >
        Оформить заказ
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const userId = computed(() => store.state.auth.user.id);

const cartItems = computed(() => store.state.cart.cartItems);

const groupedCartItems = computed(() => {
  return cartItems.value.reduce((acc, cartItem) => {
    const { product } = cartItem;

    if (!acc[product.id]) {
      acc[product.id] = [];
    }
    acc[product.id].push(cartItem);
    return acc;
  }, {});
});

const totalAmount = computed(() => {
  return cartItems.value.reduce(
    (total, cartItem) => total + (cartItem.product.price * cartItem.count),
    0
  );
});

const handleRemoveFromCart = (productId) => {
  store.dispatch('removeFromCart', { productId: productId, userId: userId.value });
};

const handleCheckout = () => {
  store.dispatch('checkout', userId.value);
};

// Загрузка корзины при монтировании
onMounted(() => {
  store.dispatch('getCart', userId.value);
});
</script>

<style scoped>
.cart-container {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 25%;
  z-index: 999;
}

.cart-float {
  max-height: 400px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.close-icon {
  cursor: pointer;
  font-size: 20px;
  color: red;
  margin-left: 5px;
}

.total-amount {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}
</style>
