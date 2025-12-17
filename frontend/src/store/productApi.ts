// src/services/productApi.ts
import { api } from "./api";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ➤ CREATE PRODUCT
    addProduct: builder.mutation({
      query: (formData: FormData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    // ➤ GET ALL PRODUCTS
    getProducts: builder.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    // ➤ GET PRODUCT BY ID
    getProductById: builder.query({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    // ➤ GET PRODUCT BY SLUG
    getProductBySlug: builder.query({
      query: (slug: string) => ({
        url: `/products/slug/${slug}`, // note: backend must support this route
        method: "GET",
      }),
      providesTags: (_result, _error, slug) => [{ type: "Product", id: slug }],
    }),

    // ➤ UPDATE PRODUCT
    updateProduct: builder.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        "Product",
      ],
    }),

    // ➤ DELETE PRODUCT
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductBySlugQuery, // ✅ new hook
} = productApi;
