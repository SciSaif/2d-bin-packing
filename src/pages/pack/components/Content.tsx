import React from "react";

type ContentProps = {
    noImagesUploaded: boolean;
};

const Content = ({ noImagesUploaded }: ContentProps) => {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h1 className="mb-2 text-xl font-bold text-secondary-900 sm:text-2xl">
                Welcome to Pack4Print
            </h1>

            <p className="sm:text-lg">
                {noImagesUploaded
                    ? "To get started, drop the images you want to print in the area below."
                    : "Scroll down to the resizing area where you can resize each image with respect to the paper size"}
            </p>
        </div>
    );
};

export default Content;
