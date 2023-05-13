import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = 'http://localhost:5050';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_URL
    }),
    tagTypes: ['Posts', 'Images'],
    endpoints: builder => ({})
})
