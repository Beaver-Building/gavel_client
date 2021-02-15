import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import Axios from 'axios'
import Vuex from 'vuex';
import AsyncComputed from 'vue-async-computed'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // role: 'engineer',
    // username: '',
    // id: -1,
    account:{
      user: null,
      alias: null,
      name: null,
      is_engineer: false,
      is_reviewer: false,
      is_admin: false,
      title: 1,
      latest_process: -1,
      latest_stage: -1
    }
  },
  mutations: {
    setAccount (state, userAccount) {
      state.account = userAccount
    },
    switch2Reviewer (state) {
      state.account.is_reviewer = !state.account.is_reviewer 
    },
    switch2Admin (state) {
      state.account.is_admin = !state.account.is_admin
    },
    // switchID(state) {
    //   state.id = 2
    // }
  }
})



Vue.use(AsyncComputed, {
  default: {context:'Loading...'}
});


Vue.config.productionTip = false

Vue.prototype.$http = Axios;

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
