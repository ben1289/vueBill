import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import { Field, Button, Form, Tab, Tabs, NavBar, Notify, Toast } from 'vant';

Vue.config.productionTip = true;

axios.defaults.baseURL = '/api';
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$notify = Notify;
Vue.prototype.$toast = Toast;
Vue.use(Field);
Vue.use(Button);
Vue.use(Form);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(NavBar);

/*路由守卫 如果未登录则跳到/login*/
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (JSON.stringify(store.state.user) === "{}") {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

/*全局状态存储*/
let store = {
  debug: true,
  state: {
    user: localStorage.getItem("user") ? localStorage.getItem("user") : {}
  },
  setUserAction(user) {
    if (this.debug) console.log('setUserAction triggered with', user);
    this.state.user = user;
  },
  clearUserAction() {
    if (this.debug) console.log('clearUserAction triggered');
    this.state.user = {};
  }
};
Vue.prototype.$store = store;

new Vue({
  render: h => h(App),
  router
}).$mount('#app');