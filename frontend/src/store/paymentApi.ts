import { api } from "./api";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 👉 Create Razorpay order from backend
    createRazorpayOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `/payment/razorpay/create`,
        method: "POST",
        body: { orderId },
      }),
      invalidatesTags: ["Order"],
    }),

    // 👉 Verify Razorpay payment (signature verification)
    verifyRazorpayPayment: builder.mutation({
      query: (body) => ({
        url: `/payment/razorpay/verify`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    // 👉 Optional: Get payment status by orderId
    getPaymentStatus: builder.query({
      query: (orderId: string) => `/payment/status/${orderId}`,
      providesTags: ["Order"],
    }),
  }),
});

// Auto-generated hooks
export const {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useGetPaymentStatusQuery,
} = paymentApi;
