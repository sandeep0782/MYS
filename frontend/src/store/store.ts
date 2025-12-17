// import { configureStore } from "@reduxjs/toolkit";
// import {
//   persistReducer,
//   persistStore,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import userReducer from "./slice/userSlice"; // make sure this path is correct
// import { api } from "./api";
// import { setupListeners } from "@reduxjs/toolkit/query";

// // Persist config
// const userPersistConfig = {
//   key: "user",
//   storage,
//   whitelist: ["user", "isEmailVerified", "isLoggedIn"],
// };

// const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// export const store = configureStore({
//   reducer: {
//     [api.reducerPath]: api.reducer,
//     user: persistedUserReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(api.middleware),
// });

// setupListeners(store.dispatch);

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { api } from "./api";
import userReducer from "./slice/userSlice";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from "./slice/wishlistSlice";
import checkouttReducer from "./slice/checkoutSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "isEmailVerified", "isLoggedIn"],
};
const cartPersistConfig = { key: "cart", storage, whitelist: ["items"] };
const wishlistPersistConfig = { key: "wishlist", storage };
const checkoutPersistConfig = { key: "checkout", storage };

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(
  wishlistPersistConfig,
  wishlistReducer
);
const persistedCheckoutReducer = persistReducer(
  checkoutPersistConfig,
  checkouttReducer
);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: persistedUserReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    checkout: persistedCheckoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
