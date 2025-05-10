import { configureStore } from "@reduxjs/toolkit";
import type { RootState } from "./rootReducer";
import rootReducer from "./rootReducer"
import { setupListeners } from "@reduxjs/toolkit/query";

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    preloadedState,
  });

  setupListeners(store.dispatch);

  return store;
};

export const store = makeStore();
export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
