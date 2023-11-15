import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface ImageBox {
//     id: string;
//     w: number;
//     h: number;
//     x: number;
//     y: number;
//     file?: File;
//     imageElement?: HTMLImageElement;
//     rotated?: boolean;
// }
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
    // images: ImageBox[];
    // boxes: ImageBox[][];
    container: ContainerType;
    isPacking: boolean;
    inResizeMode: boolean;
    isResizingAgain: boolean;
    imagesLoaded: boolean;
    filesUpdatedFlag?: boolean;
}

const initialState: initialStateProps = {
    // images: [],
    // boxes: [],
    container: defaultContainer,
    isPacking: false,
    inResizeMode: false,
    isResizingAgain: false,
    imagesLoaded: false,
    filesUpdatedFlag: false,
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

        filesUpdated: (state) => {
            state.filesUpdatedFlag = !state.filesUpdatedFlag;
        },

        // setImages: (state, action) => {
        //     state.images = action.payload;
        // },
        // setBoxes: (state, action) => {
        //     state.boxes = action.payload;
        // },

        resetState: () => initialState,
    },
});

export const {
    // setImages,
    // setBoxes,
    setContainer,
    resetState,
    setIsPacking,
    setInResizeMode,
    setIsResizingAgain,
    filesUpdated,
    setImagesLoaded,
} = mainSlice.actions;
export default mainSlice.reducer;
