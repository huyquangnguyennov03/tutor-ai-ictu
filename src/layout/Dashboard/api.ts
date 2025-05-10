import useSWR, { mutate } from "swr"
import { useMemo } from "react"

interface MenuMasterState {
  openedItem: string;
  openedComponent: string;
  openedHorizontalItem: string | null;
  isDashboardDrawerOpened: boolean;
  isComponentDrawerOpened: boolean;
}

const initialState: MenuMasterState = {
  openedItem: 'dashboard',
  openedComponent: 'buttons',
  openedHorizontalItem: null,
  isDashboardDrawerOpened: false,
  isComponentDrawerOpened: true,
};

export const endpoints = {
  key: 'helpers/menu',
  master: 'master',
  dashboard: '/dashboard', // server URL
};

export function useGetMenuMaster() {
  const { data, isLoading } = useSWR<MenuMasterState>(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading,
    }),
    [data, isLoading]
  );
}

export function handlerDrawerOpen(isDashboardDrawerOpened: boolean) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster: MenuMasterState = initialState) => ({
      ...currentMenuMaster,
      isDashboardDrawerOpened,
    }),
    false
  );
}

export function handlerActiveItem(openedItem: string) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster: MenuMasterState = initialState) => ({
      ...currentMenuMaster,
      openedItem,
    }),
    false
  );
}
