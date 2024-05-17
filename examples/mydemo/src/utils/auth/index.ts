
// token key
export const TOKEN_KEY = 'nop-token';
// 租户 key
export const TENANT_ID = 'TENANT_ID';
// login info key
export const LOGIN_INFO_KEY = 'LOGIN__INFO__';

/**
 * 获取token
 */
export function getToken() {
    return getAuthCache<string>(TOKEN_KEY);
}
/**
 * 获取登录信息
 */
export function getLoginBackInfo() {
    return getAuthCache(LOGIN_INFO_KEY);
}
/**
 * 获取租户id
 */
export function getTenantId() {
    return getAuthCache<string>(TENANT_ID);
}

export function getAuthCache<T>(key: string) {
    const fn = (key) => key;
    return fn(key) as T;
}
