import { createSlice } from '@reduxjs/toolkit';

// create a slice to store information that will be passed to react-p5 canvas

export const canvasSlice = createSlice({
    name: "canvas",
    initialState: {
        domImage: null,
        mousePos: null,
        canvasSize: null,
        hoveringElem: false,
        invert: false

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
        },
        setHovering(state, action) {
            state.hoveringElem = action.payload;
        },
        setInvert(state, action) {
            state.invert = action.payload;
        },

    }
});

export const getDomImage = (state) => state.canvas.domImage;
export const getMousePos = (state) => state.canvas.mousePos;
export const getCanvasSize = (state) => state.canvas.canvasSize;
export const getHovering = (state) => state.canvas.hoveringElem;
export const getInvert = (state) => state.canvas.invert;

export const {
    setDomImage,
    setMousePos,
    setCanvasSize,
    setHovering,
    setInvert
} = canvasSlice.actions;

export default canvasSlice.reducer;