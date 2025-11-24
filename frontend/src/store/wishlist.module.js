import WishlistService from '../services/wishlist.service';

export const SET_WISHLIST = 'SET_WISHLIST';
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';

const state = {
    wishlistItems: []
};

const mutations = {
    [SET_WISHLIST](state, payload) {
        state.wishlistItems = payload;
    },
    [ADD_TO_WISHLIST](state, payload) {
        // payload – это одна запись wishlist, приходящая с сервера
        // (мы не будем вручную пушить, а чаще просто перезагружать список)
        state.wishlistItems.push(payload);
    },
    [REMOVE_FROM_WISHLIST](state, productId) {
        state.wishlistItems = state.wishlistItems.filter(
            (item) => item.product_id !== productId
        );
    }
};

const actions = {
    getWishlist({ commit }, userId) {
        return WishlistService.getWishlist(userId)
            .then(response => {
                commit(SET_WISHLIST, response.data);
            })
            .catch(error => {
                console.error("Ошибка при получении избранного:", error);
            });
    },

    addToWishlist({ dispatch }, { productId, userId }) {
        return WishlistService.addToWishlist(productId, userId)
            .then(() => {
                // после добавления – просто обновляем список
                dispatch('getWishlist', userId);
            })
            .catch(error => {
                console.error("Ошибка при добавлении в избранное:", error);
            });
    },

    removeFromWishlist({ dispatch }, { productId, userId }) {
        return WishlistService.removeFromWishlist(productId, userId)
            .then(() => {
                dispatch('getWishlist', userId);
            })
            .catch(error => {
                console.error("Ошибка при удалении из избранного:", error);
            });
    }
};

const getters = {
    wishlistItems: (state) => state.wishlistItems
};

export default {
    state,
    mutations,
    actions,
    getters
};
