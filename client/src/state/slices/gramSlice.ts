import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

interface FilterKeys {
    br: number;
    con: number;
    sat: number;
    red: number;
    green: number;
    blue: number;
    strength: number;
    useFilter: boolean;
    display2D: string;
    displayWEBGL: string;
}

interface Res {
    url: string,
    key: string
}

interface Resolutions {
    res_1536: Res
    res_1280: Res
    res_1024: Res
    res_768: Res
    res_640: Res
    res_320: Res
}

interface NewPhoto {
    type: string;
    description: string;
    title: string;
    authors: string[];
    source: Resolutions | Object;
    details: Resolutions[];
}

interface GramState {
    filterKeys: FilterKeys,
    newMedia: NewPhoto,
    canvasImg: string
}

const initialState: GramState = {
    filterKeys: {
        br: 1.0,
        con: 1.0,
        sat: 1.0, 
        red: 1.0,
        green: 1.0,
        blue: 1.0,
        strength: 1.0,
        useFilter: false,
        display2D: "block",
        displayWEBGL: "hidden"
    },
    newMedia: {
        type: "",
        description: "",
        title: "",
        authors: [],
        source: {},
        details: []
    },
    canvasImg: ""
}

export const gramSlice = createSlice({
    name: "gram",
    initialState, 
    reducers: {
        setFilterKeys(state, action) {
            state.filterKeys = action.payload;
        },
        setType(state, action) {
            state.newMedia = {...state.newMedia, type: action.payload};
        },
        setDescription(state, action) {
            state.newMedia = {...state.newMedia, description: action.payload};
        },
        setTitle(state, action) {
            state.newMedia = {...state.newMedia, title: action.payload};
        },
        setAuthors(state, action) {
            let temp = state.newMedia.authors.slice();
            temp.push(action.payload);

            state.newMedia = {...state.newMedia, authors: temp};
        },
        setSource(state, action) {
            state.newMedia = {...state.newMedia, source: action.payload};
        },
        setDetails(state, action) {
            let temp = state.newMedia.details.slice();
            temp.push(action.payload);

            state.newMedia = {...state.newMedia, details: temp};
        },
        resetNewMedia(state, action) {
            state.newMedia = {
                type: "",
                description: "",
                title: "",
                authors: [],
                source: {},
                details: []
            }
        },
        setCanvasImg(state, action) {
            state.canvasImg = action.payload
        }
        
    }
});

export const getFilterKeys = (state: RootState) => state.gram.filterKeys;
export const getNewMedia = (state: RootState) => state.gram.newMedia;
export const getCanvasImg = (state: RootState) => state.gram.canvasImg;

export const {
    setFilterKeys,
    setType,
    setDescription,
    setTitle,
    setAuthors,
    setSource,
    setDetails, 
    resetNewMedia,
    setCanvasImg
} = gramSlice.actions;

export default gramSlice.reducer;