import {createRouter, createWebHashHistory} from 'vue-router'
import { XuiPage } from '@nop-chaos/sdk';

export const RootRoute: any = {
    path: '/',
    name: 'Root',
    redirect: '/dashboard',
    meta: {
        title: 'Root',
    },
};

export const LoginRoute: any = {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/sys/login/Login.vue'),
    meta: {
        title: 'Login',
    },
};

export const mainOutRoutes: any[] = [
    {
        path: '/amis/:path(.*\.page\.yaml)',
        name: 'default-page',
        component: XuiPage,
        meta: {
            title: 'Page',
            hideMenu: true,
            hideBreadcrumb: true,
        },

        props: (route) => {
            return { path: '/' + route.params.path }
        }
    },

    {
        path: '/pages/',
        name: 'jsonPage',
        component: XuiPage,
        meta: {
            title: 'Page',
            hideMenu: true,
            hideBreadcrumb: true,
        },

        props: (route) => {
            return { path: '/' + route.params.path }
        }
    },
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
    routes: [LoginRoute, RootRoute, ...mainOutRoutes],
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
});
