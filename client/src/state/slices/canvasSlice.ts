import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

interface CanvasState {
    domImage: string | null;
    mousePos: number[] | null;
    canvasSize: number | null;
    hoveringElem: boolean;
    invert: boolean;
    pressing: boolean;
}

const initialState: CanvasState = {
    domImage: null,
    mousePos: null,
    canvasSize: null,
    hoveringElem: false,
    invert: false,
    pressing: false
}

export const canvasSlice = createSlice({
    name: "canvas",
    initialState, 
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

export const getDomImage = (state: RootState) => state.canvas.domImage;
export const getMousePos = (state: RootState) => state.canvas.mousePos;
export const getCanvasSize = (state: RootState) => state.canvas.canvasSize;
export const getHovering = (state: RootState) => state.canvas.hoveringElem;
export const getInvert = (state: RootState) => state.canvas.invert;
export const getPressing = (state: RootState) => state.canvas.pressing;

export const {
    setDomImage,
    setMousePos,
    setCanvasSize,
    setHovering,
    setInvert,
    setPressing
} = canvasSlice.actions;

export default canvasSlice.reducer;