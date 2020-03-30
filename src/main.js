import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import {Notify, Toast} from 'vant'
import { Col, Row, Field, Button, Form, Tab, Tabs, NavBar, Tabbar, TabbarItem, Icon, DropdownMenu, DropdownItem,
  DatetimePicker, List, Cell } from 'vant';
import './font/iconfont/iconfont.css'

Vue.config.productionTip = true;

axios.defaults.baseURL = '/api';
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$notify = Notify;
Vue.prototype.$toast = Toast;
Vue.use(Col);
Vue.use(Row);
Vue.use(Field);
Vue.use(Button);
Vue.use(Form);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(NavBar);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Icon);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(DatetimePicker);
Vue.use(List);
Vue.use(Cell);

/*路由守卫 如果未登录则跳到/login*/
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (JSON.stringify(store.state.user) === "{}") {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      if (!store.state.isLogin) {
        let params = {account: store.jsonParse(store.state.user)["userName"], password: store.jsonParse(store.state.user)["password"]};
        axios.post("/login", qs.stringify(params)).then();
        store.setIsLoginAction(true);
      }
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
    isLogin: false,
    user: localStorage.getItem("user") ? localStorage.getItem("user") : {},
    currentDate: new Date()
  },
  jsonParse(json) {
    return typeof json === "string" ? JSON.parse(json) : json;
  },
  setIsLoginAction(isLogin) {
    if (this.debug) console.log('setIsLoginAction triggered with', isLogin);
    this.state.isLogin = isLogin;
  },
  setUserAction(user) {
    if (this.debug) console.log('setUserAction triggered with', user);
    this.state.user = user;
  },
  clearUserAction() {
    if (this.debug) console.log('clearUserAction triggered');
    this.state.user = {};
  },
  setCurrentDate(currentDate) {
    if (this.debug) console.log('setCurrentDate triggered with', currentDate);
    this.state.currentDate = currentDate;
  }
};
Vue.prototype.$store = store;

new Vue({
  render: h => h(App),
  router
}).$mount('#app');