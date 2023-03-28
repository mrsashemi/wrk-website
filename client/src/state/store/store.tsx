import { configureStore } from '@reduxjs/toolkit';
import { canvasSlice } from '../slices/canvasSlice';
import { pageSlice } from '../slices/pageSlice';

export const store = configureStore({
    reducer: {
        canvas: canvasSlice.reducer,
        page: pageSlice.reducer
    },
    devTools: true
})