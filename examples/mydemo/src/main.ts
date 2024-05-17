import { createApp } from 'vue'
// import './style.css'

import App from './App.vue'
import {initNopApp} from './nop/initNopApp'
import {router} from "./router";
import {getMenuList} from "./router/menu.ts";
import {PAGE_NOT_FOUND_ROUTE} from "./router/basic.ts";
import {transformObjToRoute} from "./router/routeHealper.ts";

let dynamicAddedRoute = false;

const setupRouter = (router) => {
    router.beforeEach(async (to, from, next) => {
        if (dynamicAddedRoute) {
            next();
            return;
        }
        dynamicAddedRoute = true;
        let routeList = (await getMenuList());
        let hasIndex: boolean = false;
        let hasIcon: boolean = false;
        for (let menuItem of routeList) {
            // 条件1：判断组件是否是 layouts/default/index
            if (!hasIndex) {
                hasIndex = menuItem.component === 'layouts/default/index';
            }
            // 条件2：判断图标是否带有 冒号
            if (!hasIcon) {
                hasIcon = !!menuItem.meta?.icon?.includes(':');
            }
            // 满足任何一个条件都直接跳出循环
            if (hasIcon || hasIndex) {
                break;
            }
        }
        // 动态引入组件
        routeList = transformObjToRoute(routeList);
        const routes = [PAGE_NOT_FOUND_ROUTE, ...routeList]
        routes.forEach((route) => {
            router.addRoute(route);
        });
        router.addRoute(PAGE_NOT_FOUND_ROUTE);
        if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
            // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
            next({ path: to.fullPath, replace: true, query: to.query });
        } else {
            const redirectPath = (from.query.redirect || to.path) as string;
            const redirect = decodeURIComponent(redirectPath);
            const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
            next(nextData);
        }
    });
}

const app = createApp(App);


// 配置路由
app.use(router);
//
setupRouter(router);
// 配置 nop
initNopApp(app);

app.mount('#app')
