import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ContainerType {
    w: number;
    h: number;
    scaleFactor: number;
    margin: Margin;
    padding: number;
}

const defaultContainer: ContainerType = {
    w: 595 * 2,
    h: 842 * 2,
    scaleFactor: 0.3,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: 5,
};
export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface initialStateProps {
    container: ContainerType;
    isPacking: boolean;
    inResizeMode: boolean;
    isResizingAgain: boolean;
    imagesLoaded: boolean;
    startingMaxWidthFactor: number;
    filesUpdatedFlag?: boolean;
}

const initialState: initialStateProps = {
    container: defaultContainer,
    isPacking: false,
    inResizeMode: false,
    isResizingAgain: false,
    imagesLoaded: false,
    filesUpdatedFlag: false,
    startingMaxWidthFactor: 0.4,
};

export const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        setImagesLoaded: (state, action: PayloadAction<boolean>) => {
            state.imagesLoaded = action.payload;
        },

        setIsPacking: (state, action: PayloadAction<boolean>) => {
            state.isPacking = action.payload;
        },
        setIsResizingAgain: (state, action: PayloadAction<boolean>) => {
            state.isResizingAgain = action.payload;
        },
        setInResizeMode: (state, action: PayloadAction<boolean>) => {
            state.inResizeMode = action.payload;
        },

        setContainer: (state, action: PayloadAction<ContainerType>) => {
            state.container = action.payload;
        },

        setStartingMaxWidthFactor: (state, action: PayloadAction<number>) => {
            state.startingMaxWidthFactor = action.payload;
        },

        filesUpdated: (state) => {
            state.filesUpdatedFlag = !state.filesUpdatedFlag;
        },

        resetState: () => initialState,
    },
});

export const {
    setContainer,
    resetState,
    setIsPacking,
    setInResizeMode,
    setStartingMaxWidthFactor,
    setIsResizingAgain,
    filesUpdated,
    setImagesLoaded,
} = mainSlice.actions;
export default mainSlice.reducer;
