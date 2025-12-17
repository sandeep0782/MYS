import { api } from "./api";

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 👉 Get wishlist for logged-in user
    getWishlist: builder.query({
      query: (userId: string) => `/wishlist/${userId}`,
    }),

    // 👉 Add product to wishlist
    addToWishlist: builder.mutation({
      query: (body) => ({
        url: `/wishlist/add`,
        method: "POST",
        body,
      }),
    }),

    // 👉 Remove product from wishlist
    removeFromWishlist: builder.mutation({
      query: (productId: string) => ({
        url: `/wishlist/remove/${productId}`,
        method: "DELETE",
      }),
    }),

    // 👉 Clear entire wishlist
    clearWishlist: builder.mutation({
      query: () => ({
        url: `/wishlist/clear`,
        method: "DELETE",
      }),
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;
