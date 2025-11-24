import CartService from '../services/cart.service';

// константы типов
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const SET_CART = 'SET_CART';

// состояние
const state = {
    cartItems: []
};

// мутации
const mutations = {
    [SET_CART](state, payload) {
        state.cartItems = payload;
    },
    [ADD_TO_CART](state, payload) {
        state.cartItems.push(payload);
    },
    [REMOVE_FROM_CART](state, payload) {
        state.cartItems = state.cartItems.filter(item => item.id !== payload);
    }
};

// действия
const actions = {
    addToCart({ dispatch }, { productId, userId }) {
        return CartService.addToCart(productId, userId)
            .then(() => {
                // после изменения корзины сразу обновляем её
                dispatch('getCart', userId);
            })
            .catch(error => {
                console.error('Ошибка при добавлении товара в корзину:', error);
            });
    },

    removeFromCart({ dispatch }, { productId, userId }) {
        return CartService.removeFromCart(productId, userId)
            .then(() => {
                dispatch('getCart', userId);
            })
            .catch(error => {
                console.error('Ошибка при удалении товара из корзины:', error);
            });
    },

    getCart({ commit }, userId) {
        return CartService.getCart(userId)
            .then(response => {
                commit(SET_CART, response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении корзины:', error);
            });
    },

    checkout({ dispatch }, userId) {
        return CartService.checkout(userId)
            .then(() => {
                // после оформления getCart вернёт пустой список,
                // потому что price у позиций уже не null
                dispatch('getCart', userId);
            })
            .catch(error => {
                console.error('Ошибка при оформлении заказа:', error);
            });
    }
};

const getters = {
    cartItems: (state) => state.cartItems,
};

export default {
    state,
    mutations,
    actions,
    getters
};
