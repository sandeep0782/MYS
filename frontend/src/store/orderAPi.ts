import { api } from "./api";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✔ Create a new order

    // ✔ Get all orders by user
    getOrdersByUser: builder.query({
      query: (userId: string) => `/order/user/${userId}`,
      providesTags: ["Order"],
    }),

    // ✔ Get a single order
    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ["Order"],
    }),

    // ✔ Create Razorpay order
    createRazorpayOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `/payment/razorpay/create`,
        method: "POST",
        body: { orderId },
      }),
      invalidatesTags: ["Order"],
    }),

    // ✔ Verify Razorpay payment
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: `/payment/razorpay/verify`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    // ✔ Cancel order
    cancelOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `/order/cancel/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order"],
    }),

    createOrUpdateOrder: builder.mutation({
      query: (body) => ({
        url: "/order",
        method: "POST",
        body,
      }),
    }),

    createRazorpayPayment: builder.mutation({
      query: (payload: { orderId: string }) => ({
        url: "/order/razorpay",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetOrdersByUserQuery,
  useGetOrderByIdQuery,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useCancelOrderMutation,
  useCreateOrUpdateOrderMutation,
  useCreateRazorpayPaymentMutation,
} = orderApi;
