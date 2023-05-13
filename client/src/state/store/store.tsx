import { configureStore, Middleware } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import { canvasSlice } from '../slices/canvasSlice';
import { gramSlice } from '../slices/gramSlice';
import { pageSlice } from '../slices/pageSlice';

export const store = configureStore({
    reducer: {
        canvas: canvasSlice.reducer,
        page: pageSlice.reducer,
        gram: gramSlice.reducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat((apiSlice.middleware as Middleware)),
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch