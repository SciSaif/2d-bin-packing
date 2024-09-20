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
import { ImageBox } from "../Pack";
import { clearFileInput } from "../../../utils";

const MAX_IMAGES_TO_SHOW = 20;

interface Props {
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    setBoxes: React.Dispatch<React.SetStateAction<ImageBox[][]>>;
}

const FileDropArea = ({ images, setImages, setBoxes }: Props) => {
    const dispatch = useAppDispatch();
    const [showAllImages, setShowAllImages] = useState(false);

    const removeImage = (id: any) => {
        setImages(images.filter((image) => image.id !== id));

        // if all images are removed, reset the state
        if (images.length === 1) {
            clearFileInput();
        }

        // dispatch(filesUpdated());
        // execute after 50ms to allow the state to update
        setTimeout(() => {
            dispatch(filesUpdated());
        }, 50);
    };

    const {
        dragging,
        files,
        handleDragOver,
        handleDrop,
        mainRef,
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
        const imagesToShow = showAllImages
            ? images
            : images.slice(0, MAX_IMAGES_TO_SHOW);

        return imagesToShow.map((image) => (
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
    }, [images, filesUpdated, showAllImages]); // Dependency on images and filesUpdated

    return (
        <>
            <div
                ref={mainRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onPaste={handlePaste}
                className={twMerge(
                    "w-full border-2 flex flex-col border-tertiary/50  border-dashed rounded-xl bg-slate-100 shadow mt-10",
                    dragging && "border-blue-500 bg-sky-100"
                )}
            >
                <div
                    onClick={triggerFileInput}
                    className="flex items-center cursor-pointer select-none justify-center flex-grow min-h-[200px] w-full text-xl font-bold text-tertiary/50"
                >
                    Drop Files or Click to Upload
                </div>
                {images.length > 0 && (
                    <div className="mx-2 border-t ">
                        {/* show preview of images here with option to remove them */}
                        {images.length > 0 && (
                            <div className="mx-2 border-t">{imagePreviews}</div>
                        )}
                        {images.length > MAX_IMAGES_TO_SHOW && (
                            <button
                                onClick={() => setShowAllImages(!showAllImages)}
                                className="w-full py-2 mt-2 text-sm font-medium underline text-secondary-600 hover:text-secondary-800"
                            >
                                {showAllImages
                                    ? "Hide"
                                    : `Show ${
                                          images.length - MAX_IMAGES_TO_SHOW
                                      } more images`}
                            </button>
                        )}
                    </div>
                )}
            </div>
            {/* Hidden file input */}
            <input
                id="fileInput"
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
