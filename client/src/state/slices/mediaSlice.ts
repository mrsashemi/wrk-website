import { apiSlice } from "../api/apiSlice";


export const mediaApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        saveMedia: builder.mutation<any, any>({
            query: (data) => ({
                url: '/img/save-image',
                method: 'POST',
                body: data
            }),
            invalidatesTags: [
                {type: 'Images', id: 'LIST'}
            ] 
        })
    })
})

export const {
    useSaveMediaMutation
} = mediaApiSlice