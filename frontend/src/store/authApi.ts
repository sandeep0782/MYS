// src/services/authApi.ts
import { api, BASE_URL } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
    }),

    // In your authApi slice
    verifyEmail: builder.mutation({
      query: (token: string) => ({
        url: `/auth/verify-email/${token}`,
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/auth/reset-password/${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),

    verifyAuth: builder.mutation({
      query: () => ({
        url: "/auth/verify-auth",
        method: "GET",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyAuthMutation,
  useLogoutMutation,
} = authApi;
