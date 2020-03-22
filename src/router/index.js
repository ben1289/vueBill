import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: Home,
            meta: {requiresAuth: true}
        },
        {
            // 设置默认路由
            path: '*',
            redirect: {name: 'home'}
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
})