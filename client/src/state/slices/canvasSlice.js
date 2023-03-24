import { createSlice } from '@reduxjs/toolkit';

// create a slice to store information that will be passed to react-p5 canvas

export const canvasSlice = createSlice({
    name: "canvas",
    initialState: {
        domImage: null,
        mousePos: null,
        canvasSize: null,
        hoveringElem: false,
        invert: false,
        pressing: false
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
        setPressing(state, action) {
            state.pressing = action.payload;
        }
    }
});

export const getDomImage = (state) => state.canvas.domImage;
export const getMousePos = (state) => state.canvas.mousePos;
export const getCanvasSize = (state) => state.canvas.canvasSize;
export const getHovering = (state) => state.canvas.hoveringElem;
export const getInvert = (state) => state.canvas.invert;
export const getPressing = (state) => state.canvas.pressing;

export const {
    setDomImage,
    setMousePos,
    setCanvasSize,
    setHovering,
    setInvert,
    setPressing
} = canvasSlice.actions;

export default canvasSlice.reducer;