import { createSlice } from '@reduxjs/toolkit';

export const pageSlice = createSlice({
    name: "page",
    initialState: {
        setting: {
            query: 640,
            orientation: 'height'
        },
        pageOrientation: "portrait",
        homeNavContainer: {
            margin: "1rem",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "center",
            gap: "0"
        },
        homeNavLinks: {
            fontSize: "1.25rem",
            lineHeight: "1.75rem"
        },
        homeTitle: {
            fontSize: "4.5rem",
            lineHeight: "1",
            marginRight: "0.5rem",
            marginBottom: "0"
        },
    },
    reducers: {
        setCurrentSettings(state, action) {
            state.setting = action.payload;
        },
        setPageOrientation(state, action) {
            if (action.payload.orientation === "portrait") {
                state.homeNavContainer = {
                    ...state.homeNavContainer, 
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "center"
                }
            } else {
                state.homeNavContainer = {
                    ...state.homeNavContainer, 
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "start"
                }
            }

            state.homeNavContainer = {
                ...state.homeNavContainer,
                ...action.payload.navContainer
            }
            state.homeNavLinks = action.payload.navLinks;
            state.homeTitle = action.payload.homeTitle
            state.pageOrientation = action.payload.orientation;
        },
    }
});

export const getPageOrientation = (state) => state.page.pageOrientation;
export const getHomeNavContainer = (state) => state.page.homeNavContainer;
export const getHomeNavLinks = (state) => state.page.homeNavLinks;
export const getHomeTitle = (state) => state.page.homeTitle;
export const getSetting = (state) => state.page.setting;

export const {
    setCurrentSettings,
    setPageOrientation,
} = pageSlice.actions;

export default pageSlice.reducer;