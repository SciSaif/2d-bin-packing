import React from "react";
import { useAppSelector } from "../../../redux/hooks";

type ContentProps = {
    noImagesUploaded: boolean;
};

const Content = ({ noImagesUploaded }: ContentProps) => {
    const { isPacking, inResizeMode } = useAppSelector((state) => state.main);
    let content =
        "To get started, drop the images you want to print in the area below.";

    if (!noImagesUploaded) {
        content =
            "Scroll down to the resizing area where you can resize each image with respect to the paper size";
    }
    if (isPacking) {
        content =
            "Packing your images. If it is taking too long, try reducing packing efficiency.";
    } else if (!inResizeMode) {
        content =
            "You can now save as PDF or click on the resize button to go back and resize the images. The print button is not working properly at the moment.";
    }

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h1 className="mb-2 text-xl font-bold text-secondary-900 sm:text-2xl">
                Welcome to Pack4Print
            </h1>

            <p className="sm:text-lg">{content}</p>
        </div>
    );
};

export default Content;
