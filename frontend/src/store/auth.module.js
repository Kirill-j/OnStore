import AuthService from '../services/auth.service';

var user = JSON.parse(localStorage.getItem('user'));

// состояния: авторизованный или нет
const state = () => ({
    authData: {
        token: "",
        refreshToken: "",
        tokenExp: ""
    },
    status: user ? { loggedIn: true } : { loggedIn: false },
    user: user ? user : null
});

// получение данных
const getters = {
    getLoginStatus(state) {
        return state.status;
    },
    getAuthData() {
        const user = JSON.parse(localStorage.getItem("user"));

        return {
            user: user
        };
    },
    isTokenActive() {
        const user = JSON.parse(localStorage.getItem("user"));
        const tokenExp = JSON.parse(localStorage.getItem("tokenExp"));
        if (!user || !tokenExp) {
            return false;
        }
        var result = AuthService.tokenAlive(tokenExp);
        return result;
    }
};

// действия
const actions = {
    login({ commit }, user) {
        return AuthService.login(user).then(
            user => {
                commit("loginSuccess", user);
                return Promise.resolve(user);
            },
            error => {
                commit('loginFailure');
                return Promise.reject(error);
            }
        );
    },
    logout({ commit }) {
        AuthService.logout();
        commit('logout');
    },
    register({ commit }, user) {
        return AuthService.register(user).then(
            response => {
                commit('registerSuccess');
                return Promise.resolve(response.data);
            },
            error => {
                commit('registerFailure');
                return Promise.reject(error);
            }
        );
    },
    refreshToken({ commit }, user) {
        return AuthService.refreshToken(user).then(
            user => {
                commit('saveTokenData', user);
                return Promise.resolve(user);
            },
            error => {
                console.log(error);
                return Promise.reject(error);
            }
        );
    }
};

// мутации
const mutations = {
    loginSuccess(state, user) {
        state.status.loggedIn = true;
        state.user = user;

        const jwtDecodedValue = AuthService.jwtDecrypt(user.accessToken);
        const newTokenData = {
            token: user.accessToken,
            tokenExp: jwtDecodedValue.exp
        };
        localStorage.setItem('tokenExp', JSON.stringify(newTokenData.tokenExp));
        state.authData = newTokenData;
    },
    loginFailure(state) {
        state.status.loggedIn = false;
        state.user = null;
    },
    logout(state) {
        state.status.loggedIn = false;
        state.user = null;
    },
    registerSuccess(state) {
        state.status.loggedIn = false;
    },
    registerFailure(state) {
        state.status.loggedIn = false;
    },
    saveTokenData(state, user) {
        const jwtDecodedValue = AuthService.jwtDecrypt(user.accessToken);
        const newTokenData = {
            token: user.accessToken,
            tokenExp: jwtDecodedValue.exp
        };
        state.authData = newTokenData;
    },
    setLoginStatus(state, value) {
        state.loginStatus = value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
