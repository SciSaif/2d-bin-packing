import { useEffect } from "react";

const usePreventScroll = (isActive: boolean) => {
    useEffect(() => {
        const preventDefaultWhenDragging = (e: TouchEvent) => {
            if (isActive) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchmove", preventDefaultWhenDragging, {
            passive: false,
        });

        return () => {
            document.removeEventListener(
                "touchmove",
                preventDefaultWhenDragging
            );
        };
    }, [isActive]);
};

export default usePreventScroll;
