import { configureStore } from '@reduxjs/toolkit';
import { canvasSlice } from '../slices/canvasSlice';

export const store = configureStore({
    reducer: {
        canvas: canvasSlice.reducer
    },
    devTools: true
})