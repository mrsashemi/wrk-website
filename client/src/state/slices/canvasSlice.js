import { createSlice } from '@reduxjs/toolkit';

// create a slice to store information that will be passed to react-p5 canvas

export const canvasSlice = createSlice({
    name: "canvas",
    initialState: {
        domImage: null,
        mousePos: null,
        canvasSize: null

    }, 
    reducers: {
        setDomImage(state, action) {
            state.domImage = action.payload;
        }, 
        setMousePos(state, action) {
            state.mousePos = action.payload;
        },
        setCanvasSize(state, action) {
            state.canvasSize = action.payload;
        }
    }
});

export const getDomImage = (state) => state.canvas.domImage;
export const getMousePos = (state) => state.canvas.mousePos;
export const getCanvasSize = (state) => state.canvas.canvasSize;

export const {
    setDomImage,
    setMousePos,
    setCanvasSize
} = canvasSlice.actions;

export default canvasSlice.reducer;