import React, { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface ImageData {
    img: HTMLImageElement;
    width: number;
    height: number;
    y: number;
}

// I want a feature where we can input multiple images and display those images in a canvas ,
// the canvas should have a fixed width but the height will by dynamic and will increase if the images need space to fit.
// The images will  be place one below the other.
// Now, I want the feature to click on the bottom right corner of the images and drag to resize them.
// As I am resizing, the images should move so as to not overlap.
// while resizing, the image's aspect ratio should not change.
// I need to keep track of each image's new dimensions.

const ImageSizing: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dragging, setDragging] = useState<number | null>(null);
    const [lastY, setLastY] = useState<number>(0);
    const [uploadedFiles, setUploadedFiles] = useState<
        { id: string; file: File }[]
    >([]);
    // useEffect(() => {
    //     drawImages();
    // }, [images]);

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);
        const promises: Promise<void>[] = [];
        files.forEach((file) => {
            promises.push(
                new Promise((resolve) => {
                    const img = new Image();
                    const id = uuidv4();

                    img.onload = () => {
                        setUploadedFiles((prev) => [...prev, { id, file }]);
                        resolve();
                    };
                    img.src = URL.createObjectURL(file);
                })
            );
        });
        Promise.all(promises).then(() => {
            console.log(uploadedFiles);
        });
        // for (const file of files) {
        //     const img = new Image();
        //     img.src = URL.createObjectURL(file);
        //     await new Promise(
        //         (resolve) =>
        //             (img.onload = () => {
        //                 newImages.push({
        //                     img,
        //                     width: img.width,
        //                     height: img.height,
        //                     y: 0,
        //                 });
        //                 resolve(null);
        //             })
        //     );
        // }

        // setImages((prevImages) => [...prevImages, ...newImages]);
    };

    const drawImages = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        let y = 0;
        images.forEach((data, index) => {
            ctx?.drawImage(data.img, 0, y, data.width, data.height);
            images[index].y = y;
            y += data.height;
        });
        canvas.height = y;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        for (let i = 0; i < images.length; i++) {
            const imgData = images[i];
            if (
                x > imgData.width - 10 &&
                x < imgData.width &&
                y > imgData.y + imgData.height - 10 &&
                y < imgData.y + imgData.height
            ) {
                setDragging(i);
                setLastY(y);
                break;
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragging !== null) {
            const deltaY = e.nativeEvent.offsetY - lastY;
            const aspectRatio =
                images[dragging].img.width / images[dragging].img.height;
            const newHeight = images[dragging].height + deltaY;
            const newWidth = newHeight * aspectRatio;

            setImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[dragging].width = newWidth;
                newImages[dragging].height = newHeight;
                return newImages;
            });

            setLastY(e.nativeEvent.offsetY);
            drawImages();
        }
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    return (
        <div>
            <input type="file" multiple onChange={handleImageChange} />
            <canvas
                ref={canvasRef}
                width={500}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            ></canvas>
        </div>
    );
};

export default ImageSizing;
