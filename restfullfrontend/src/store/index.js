import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem('token') || '',
    status: '',
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, { token, user }) {
      state.status = 'success';
      state.token = token;
      state.user = user;
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.user = null;
    },
  },
  actions: {
    async login({ commit }, user) {
      try {
        commit('auth_request');
        const response = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        const token = data.token;
        const user = data.user;
        localStorage.setItem('token', token);
        commit('auth_success', { token, user });
        return data;
      } catch (error) {
        commit('auth_error');
        localStorage.removeItem('token');
        throw error;
      }
    },
    async register({ commit }, user) {
      try {
        commit('auth_request');
        const response = await fetch('http://localhost:8080/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        const token = data.token;
        const user = data.user;
        localStorage.setItem('token', token);
        commit('auth_success', { token, user });
        return data;
      } catch (error) {
        commit('auth_error');
        localStorage.removeItem('token');
        throw error;
      }
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('token');
        resolve();
      });
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    user: state => state.user,
  },
});
