import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // 👉 Fetch logged-in user profile
    getUserProfile: builder.query({
      query: () => `/user/profile`,
      providesTags: ["User"],
    }),

    // 👉 Update user profile (name, phone, etc.)
    updateUserProfile: builder.mutation({
      query: (body) => ({
        url: `/user/profile/update`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // 👉 Change password
    changePassword: builder.mutation({
      query: (body) => ({
        url: `/user/change-password`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // 👉 Update user avatar (optional)
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: `/user/avatar`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // 👉 Delete user account
    deleteAccount: builder.mutation({
      query: () => ({
        url: `/user/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    

  }),
});

// Auto-generated hooks
export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useUpdateAvatarMutation,
  useDeleteAccountMutation,
} = userApi;
