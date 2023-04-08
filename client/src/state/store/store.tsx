import { configureStore } from '@reduxjs/toolkit';
import { canvasSlice } from '../slices/canvasSlice';
import { gramSlice } from '../slices/gramSlice';
import { pageSlice } from '../slices/pageSlice';

export const store = configureStore({
    reducer: {
        canvas: canvasSlice.reducer,
        page: pageSlice.reducer,
        gram: gramSlice.reducer
    },
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch