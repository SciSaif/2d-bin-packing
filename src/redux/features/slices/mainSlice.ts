import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { A3, A4, PaperSize } from "../../../data/paperSizes";

export interface ContainerType {
    w: number;
    h: number;
    scaleFactor: number;
    margin: Margin;
    padding: number;
    paperSize: PaperSize;
}

const defaultContainer: ContainerType = {
    w: 595 * 2,
    h: 842 * 2,
    scaleFactor: 0.3,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: 3,
    paperSize: A4,
};

export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export type Algorithm = "efficient" | "hff";

interface initialStateProps {
    container: ContainerType;
    isPacking: boolean;
    inResizeMode: boolean;
    imagesLoaded: boolean;
    startingMaxWidthFactor: number;
    showBorder: boolean;
    packingFactor: number;
    packingProgress: number;
    filesChangedFlag: boolean;
    algorithm: Algorithm;
}

const initialState: initialStateProps = {
    container: defaultContainer,
    isPacking: false,
    inResizeMode: true,
    imagesLoaded: false,
    startingMaxWidthFactor: 0.4,
    showBorder: false,
    packingFactor: 3,
    packingProgress: 0,
    filesChangedFlag: false,
    algorithm: "efficient",
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

        setInResizeMode: (state, action: PayloadAction<boolean>) => {
            state.inResizeMode = action.payload;
        },

        setContainer: (state, action: PayloadAction<ContainerType>) => {
            state.container = action.payload;
        },

        resetMargin: (state) => {
            state.container.margin = { top: 0, right: 0, bottom: 0, left: 0 };
        },

        setStartingMaxWidthFactor: (state, action: PayloadAction<number>) => {
            state.startingMaxWidthFactor = action.payload;
        },

        setShowBorder: (state, action: PayloadAction<boolean>) => {
            state.showBorder = action.payload;
        },
        setPackingFactor: (state, action: PayloadAction<number>) => {
            state.packingFactor = action.payload;
        },
        setPackingProgress: (state, action: PayloadAction<number>) => {
            state.packingProgress = action.payload;
        },

        setFilesChangedFlag: (state) => {
            state.filesChangedFlag = !state.filesChangedFlag;
        },
        setAlgorithm: (state, action: PayloadAction<Algorithm>) => {
            state.algorithm = action.payload;
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
    setImagesLoaded,
    setShowBorder,
    setPackingFactor,
    setPackingProgress,
    setFilesChangedFlag,
    setAlgorithm,
    resetMargin,
} = mainSlice.actions;
export default mainSlice.reducer;
