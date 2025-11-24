import { createStore } from "vuex";
import auth from './auth.module';
import cart from './cart.module';
import wishlist from './wishlist.module';

const store = createStore({
    modules: {
        auth: auth,
        cart: cart,
        wishlist: wishlist
    },
});

export default store;
