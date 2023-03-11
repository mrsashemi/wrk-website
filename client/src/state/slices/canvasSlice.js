import { createSlice } from '@reduxjs/toolkit';

// create a slice to store information that will be passed to react-p5 canvas

export const canvasSlice = createSlice({
    name: "canvas",
    initialState: {
        domImage: null,
    }, 
    reducers: {
        setDomImage(state, action) {
            state.domImage = action.payload;
        }
    }
});

export const getDomImage = (state) => state.canvas.domImage;

export const {
    setDomImage,
} = canvasSlice.actions;

export default canvasSlice.reducer;