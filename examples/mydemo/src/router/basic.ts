import { REDIRECT_NAME, LAYOUT, EXCEPTION_COMPONENT, PAGE_NOT_FOUND_NAME } from '@/router/constant';

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: any = {
    path: '/:path(.*)*',
    name: PAGE_NOT_FOUND_NAME,
    component: LAYOUT,
    meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
    },
    children: [
        {
            path: '/:path(.*)*',
            name: PAGE_NOT_FOUND_NAME,
            component: EXCEPTION_COMPONENT,
            meta: {
                title: 'ErrorPage',
                hideBreadcrumb: true,
                hideMenu: true,
            },
        },
    ],
};

export const REDIRECT_ROUTE: any = {
    path: '/redirect',
    component: LAYOUT,
    name: 'RedirectTo',
    meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
        hideMenu: true,
    },
    children: [
        {
            path: '/redirect/:path(.*)',
            name: REDIRECT_NAME,
            component: () => import('@/pages/sys/redirect/index.vue'),
            meta: {
                title: REDIRECT_NAME,
                hideBreadcrumb: true,
            },
        },
    ],
};

