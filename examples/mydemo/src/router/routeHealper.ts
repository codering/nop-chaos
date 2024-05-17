
import { cloneDeep, omit } from 'lodash-es';
import {XuiPage} from '@nop-chaos/sdk';
import { getParentLayout, LAYOUT, IFRAME } from '@/router/constant';
import { getToken, getTenantId } from '@/utils/auth';

const LayoutMap = new Map<string, any>();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);

const AMIS = XuiPage;
LayoutMap.set("AMIS", AMIS);

let dynamicViewsModules;

// Turn background objects into routing objects
export function transformObjToRoute<T>(routeList: any[]): T[] {
    routeList.forEach((route) => {
        const component = route.component as string;
        if (component) {
            if (component.toUpperCase() === 'LAYOUT') {
                route.component = LayoutMap.get(component.toUpperCase());
            } else {
                route.children = [cloneDeep(route)];
                route.component = LAYOUT;
                route.name = `${route.name}Parent`;
                route.path = '';
                const meta = route.meta || {};
                meta.single = true;
                meta.affix = false;
                route.meta = meta;
            }
        } else {
            warn('请正确配置路由：' + route?.name + '的component属性');
        }
        route.children && asyncImportRoute(route.children);
    });
    return routeList as unknown as T[];
}

function asyncImportRoute(routes: any[] | undefined) {
    if (!dynamicViewsModules) {
        dynamicViewsModules = import.meta.glob('../../pages/**/*.{vue,tsx}');
    }
    if (!routes) return;
    routes.forEach((item) => {
        item.meta = item.meta || {};
        if (item?.hidden) {
            item.meta.hideMenu = true;
            //是否隐藏面包屑
            item.meta.hideBreadcrumb = true;
        }
        if (item?.route == 0) {
            item.meta.ignoreRoute = true;
        }
        item.meta.ignoreKeepAlive = !item?.meta.keepAlive;
        let token = getToken();
        let tenantId = getTenantId();
        item.component = (item.component || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)).replace('${token}', token).replace('${tenantId}', tenantId);
        // 适配 iframe
        if (/^\/?http(s)?/.test(item.component as string)) {
            item.component = item.component.substring(1, item.component.length);
        }
        if (/^http(s)?/.test(item.component as string)) {
            if (item.meta?.internalOrExternal) {
                // @ts-ignore 外部打开
                item.path = item.component;
                item.path = item.path.replace('#', URL_HASH_TAB);
            } else {
                // @ts-ignore 内部打开
                item.meta.frameSrc = item.component;
            }
            delete item.component;
        }
        if (!item.component && item.meta?.frameSrc) {
            item.component = 'IFRAME';
        }
        // 增加Amis适配
        if(item.component == 'AMIS'){
            item.props = {
                path: item.meta.url
            }
        }
        //
        let { component, name } = item;
        const { children } = item;
        if (component) {
            const layoutFound = LayoutMap.get(component.toUpperCase());
            if (layoutFound) {
                item.component = layoutFound;
            } else {
                if (component.indexOf('dashboard/') > -1) {
                    //当数据标sys_permission中component没有拼接index时前端需要拼接
                    if (component.indexOf('/index') < 0) {
                        component = component + '/index';
                    }
                }
                item.component = dynamicImport(dynamicViewsModules, component as string);
            }
        } else if (name) {
            item.component = getParentLayout();
        }
        children && asyncImportRoute(children);
    });
}

function dynamicImport(dynamicViewsModules: Record<string, () => Promise<Recordable>>, component: string) {
    const keys = Object.keys(dynamicViewsModules);
    const matchKeys = keys.filter((key) => {
        const k = key.replace('../../pages', '');
        const startFlag = component.startsWith('/');
        const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
        const startIndex = startFlag ? 0 : 1;
        const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
        return k.substring(startIndex, lastIndex) === component;
    });
    if (matchKeys?.length === 1) {
        const matchKey = matchKeys[0];
        return dynamicViewsModules[matchKey];
    } else if (matchKeys?.length > 1) {
        console.warn(
            'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
        );
        return;
    }
}
