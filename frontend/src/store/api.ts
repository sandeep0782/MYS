// src/services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    credentials: "include",
  }),
  tagTypes: [
    "User",
    "Cart",
    "Order",
    "Product",
    "Address",
    "Color",
    "Brand",
    "Category",
  ],
  endpoints: () => ({}),
});
