import { watch, unref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useTitle as usePageTitle } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useLocaleStore } from '/@/store/modules/locale';

import { REDIRECT_NAME } from '/@/router/constant';
import { useUserStore } from '/@/store/modules/user';

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useTitle() {
  const userStore = useUserStore();
  const { t } = useI18n();
  const { currentRoute } = useRouter();
  const localeStore = useLocaleStore();

  const pageTitle = usePageTitle();

  watch(
    [() => currentRoute.value.path, () => localeStore.getLocale],
    () => {
      const route = unref(currentRoute);

      if (route.name === REDIRECT_NAME) {
        return;
      }
      const { appName } = userStore.getUserInfo;
      const tTitle = t(route?.meta?.title as string);
      pageTitle.value = tTitle ? ` ${tTitle} - ${appName} ` : `${appName}`;
    },
    { immediate: true }
  );
}
