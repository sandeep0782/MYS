import { api } from "./api";
import { Brand, BrandsResponse } from "@/lib/types/type";

export const brandApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all brands
    getBrands: builder.query<BrandsResponse, void>({
      query: () => `/brand`, // singular "brand" to match backend
      providesTags: ["Brand"],
    }),
  }),
});

export const { useGetBrandsQuery } = brandApi;
