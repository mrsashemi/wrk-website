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

interface GramState {
    filterKeys: FilterKeys
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
    }
}

export const gramSlice = createSlice({
    name: "gram",
    initialState, 
    reducers: {
        setFilterKeys(state, action) {
            state.filterKeys = action.payload;
        }
    }
});

export const getFilterKeys = (state: RootState) => state.gram.filterKeys;

export const {
    setFilterKeys
} = gramSlice.actions;

export default gramSlice.reducer;