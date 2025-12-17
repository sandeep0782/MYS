import { api } from "./api";
import { Color, ColorsResponse } from "@/lib/types/type";

export const colorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getColors: builder.query<ColorsResponse, void>({
      query: () => `/colors`,
      providesTags: ["Color"],
    }),
  }),
});

export const { useGetColorsQuery } = colorApi;
