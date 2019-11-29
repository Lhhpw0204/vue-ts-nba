import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueRouter from "vue-router";
import routes from "./routes/index"
import tools from "./utils/tools"
import '../assets/style/common.scss'
import store from "./store/index"

Vue.use(VueRouter);
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.tools = tools

const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
