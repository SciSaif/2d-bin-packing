import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setContainer } from "../redux/features/slices/mainSlice";
import { useWindowResize } from "./useWindowResize";

export const useScaleFactor = (
    containerWrapper: React.RefObject<HTMLDivElement>
) => {
    const dispatch = useAppDispatch();
    const container = useAppSelector((state) => state.main.container);
    const windowWidth = useWindowResize();

    const updateScaleFactor = () => {
        if (!containerWrapper.current) return;

        const containerWrapperWidth = containerWrapper.current.clientWidth;
        const columns = windowWidth >= 768 ? 2 : 1;
        let gridCellWidth = containerWrapperWidth / columns;

        // Subtract any grid gap if applicable
        const gap = 20;
        gridCellWidth -= gap;

        const scaleFactor = gridCellWidth / container.w;

        dispatch(setContainer({ ...container, scaleFactor }));
    };

    useEffect(() => {
        updateScaleFactor();
    }, [containerWrapper, windowWidth]);

    return updateScaleFactor;
};
