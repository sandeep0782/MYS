import { api } from "./api";

export const addressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 👉 Get all addresses
    getAddresses: builder.query<any[], void>({
      query: () => `/user/address/`, // must match backend
      providesTags: ["Address"],
    }),

    // 👉 Add OR Update Address
    addOrUpdateAddress: builder.mutation<any, any>({
      query: ({ addressId, ...body }) => ({
        url: `/user/address/create-or-update`, // must match backend
        method: "POST",
        body: {
          addressId, // optional
          ...body,
        },
      }),
      invalidatesTags: ["Address"],
    }),

    // 👉 Delete Address
    deleteAddress: builder.mutation<{ success: boolean }, string>({
      query: (addressId) => ({
        url: `/user/address/delete/${addressId}`, // if implemented in backend
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddOrUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
