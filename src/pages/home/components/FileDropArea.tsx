import React, { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import useDragAndDrop from "../../../hooks/useDragDrop";
import { createImages } from "../utils";
import {
    filesUpdated,
    setImagesLoaded,
    setInResizeMode,
} from "../../../redux/features/slices/mainSlice";
import { useAppDispatch } from "../../../redux/hooks";
import { ImageBox } from "../Home";

interface Props {
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    setBoxes: React.Dispatch<React.SetStateAction<ImageBox[][]>>;
}

const FileDropArea = ({ images, setImages, setBoxes }: Props) => {
    const dispatch = useAppDispatch();

    const removeImage = (id: any) => {
        console.log("in remove image");

        setImages(images.filter((image) => image.id !== id));
        // dispatch(filesUpdated());
        // execute after 50ms to allow the state to update
        setTimeout(() => {
            console.log("in remove image timeout");

            dispatch(filesUpdated());
        }, 50);
    };

    console.log("images", images);

    const {
        dragging,
        files,
        handleDragOver,
        handleDrop,
        handlePaste,
        fileInputRef,
        triggerFileInput,
        handleFileInputChange,
    } = useDragAndDrop();

    const handleImageUpload = async (uploadedFiles: File[]) => {
        const newImages = await createImages(uploadedFiles);
        setImages([...images, ...newImages]);
        dispatch(setImagesLoaded(false));
        dispatch(setInResizeMode(true));
        setBoxes([]);

        // dispatch(filesUpdated());
        setTimeout(() => {
            dispatch(filesUpdated());
        }, 50);
    };

    // Call handleImageUpload when files state changes
    useEffect(() => {
        if (files && files.length > 0) {
            handleImageUpload(files);
        }
    }, [files]);

    const imagePreviews = useMemo(() => {
        return images.map((image) => (
            <div
                key={image.id}
                className="relative inline-flex flex-col items-center p-2"
            >
                {image.file && (
                    <img
                        src={URL.createObjectURL(image.file)}
                        alt="Preview"
                        className="object-cover w-14 h-14"
                    />
                )}
                <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-red-500 bg-white border rounded-full shadow hover:text-red-700"
                >
                    &#10005; {/* Cross Icon */}
                </button>
            </div>
        ));
    }, [images, filesUpdated]); // Dependency on images and filesUpdated

    return (
        <>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onPaste={handlePaste}
                className={twMerge(
                    "w-full border-2 flex flex-col border-tertiary/50 cursor-pointer border-dashed rounded-xl bg-gray-100 shadow mt-10",
                    dragging && "border-blue-500 bg-sky-100"
                )}
            >
                <div
                    onClick={triggerFileInput}
                    className="flex items-center select-none justify-center flex-grow min-h-[200px] w-full text-xl font-bold text-tertiary/50"
                >
                    Drop Files or Click to Upload
                </div>
                {images.length > 0 && (
                    <div className="mx-2 border-t ">
                        {/* show preview of images here with option to remove them */}
                        {images.length > 0 && (
                            <div className="mx-2 border-t">{imagePreviews}</div>
                        )}
                    </div>
                )}
            </div>
            {/* Hidden file input */}
            <input
                type="file"
                multiple
                onChange={handleFileInputChange}
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
            />
        </>
    );
};

export default FileDropArea;
