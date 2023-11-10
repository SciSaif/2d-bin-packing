// import React, { TouchEvent, useEffect, useState } from "react";
// import { positionImages } from "../pages/imagePacker/utils";
// import { ContainerType, Margin } from "../pages/imagePacker/ImagePacker";

// export interface ImageData {
//     id: string;
//     w: number;
//     h: number;
//     x: number;
//     y: number;
//     file?: File;
// }

// interface Props {
//     images: ImageData[];
//     setImages: (images: ImageData[]) => void;
//     container: ContainerType;
//     setContainer: (container: ContainerType) => void;
// }

// const ResizingWindow: React.FC<Props> = ({
//     images,
//     setImages,
//     container,
//     setContainer,
// }) => {
//     const [selectedId, setSelectedId] = useState<null | string>(null);
//     const [isResizing, setIsResizing] = useState(false);
//     const containerRef = React.useRef<HTMLDivElement | null>(null);
//     const [localImages, setLocalImages] = useState<ImageData[]>(images);
//     const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

//     const [maxY, setMaxY] = useState(0);

//     // Function to handle margin changes
// const handleMarginChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     side: keyof Margin
// ) => {
//     const newMarginValue = parseInt(e.target.value, 10);
//     setContainer({
//         ...container,
//         margin: {
//             ...container.margin,
//             [side]: isNaN(newMarginValue) ? 0 : newMarginValue,
//         },
//     });

//     repositionImages(localImages);
// };

//     useEffect(() => {
//         // set the image urls ( this is done so that we don't have to re-render the images when resizing)
//         if (!images.length) return;
//         const newImageUrls = new Map<string, string>();
//         images.forEach((image) => {
//             if (image.file) {
//                 newImageUrls.set(image.id, URL.createObjectURL(image.file));
//             }
//         });
//         setImageUrls(newImageUrls);

//         // position the images in the container

//         const { _maxY, _localImages } = positionImages(
//             images,
//             container,
//             10,
//             true
//         );

//         setMaxY(_maxY);
//         setLocalImages(_localImages);
//     }, []);

// const handleMouseDown = (
//     e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
//     imgData: ImageData
// ) => {
//     if (
//         e.target instanceof HTMLElement &&
//         e.target.classList.contains("resize-handle")
//     ) {
//         setIsResizing(true);
//         setSelectedId(imgData.id);
//         return;
//     }

//     if (selectedId !== imgData.id) {
//         setSelectedId(imgData.id);
//     }
// };
// useEffect(() => {
//     const preventDefaultWhenResizing = (e: globalThis.TouchEvent) => {
//         if (isResizing) {
//             e.preventDefault();
//         }
//     };

//     document.addEventListener("touchmove", preventDefaultWhenResizing, {
//         passive: false,
//     });

//     return () => {
//         document.removeEventListener(
//             "touchmove",
//             preventDefaultWhenResizing
//         );
//     };
// }, [isResizing]);

//     // This function contains the shared logic for resizing
// const handleResize = (clientX: number, clientY: number) => {
//     if (isResizing && selectedId) {
//         const updatedImages = updateImageSize(clientX, clientY);
//         if (updatedImages) {
//             const repositionedImages = repositionImages(updatedImages);
//             const repositionedImage = repositionedImages.find(
//                 (img) => img.id === selectedId
//             );
//             const originalImage = localImages.find(
//                 (img) => img.id === selectedId
//             );

//             if (
//                 originalImage &&
//                 repositionedImage &&
//                 originalImage.y !== repositionedImage.y
//             ) {
//                 setIsResizing(false);
//                 setSelectedId(null);
//             }
//             setLocalImages(repositionedImages);
//         }
//     }
// };

// // Mouse move event handler
// const handleMouseMove = (e: MouseEvent) => {
//     handleResize(e.clientX, e.clientY);
// };

// // Touch move event handler
// const handleTouchMove = (e: globalThis.TouchEvent) => {
//     if (e.touches.length > 0) {
//         const touch = e.touches[0];
//         handleResize(touch.clientX, touch.clientY);
//     }
// };

// const updateImageSize = (
//     clientX: number,
//     clientY: number
// ): ImageData[] | null => {
//     const selectedImage = localImages.find((img) => img.id === selectedId);
//     if (selectedImage && containerRef.current) {
//         const aspectRatio = selectedImage.w / selectedImage.h;
//         const mouseX = clientX / container.scaleFactor;
//         const mouseY = clientY / container.scaleFactor; // Assuming you want to scale Y as well

//         const rect = containerRef.current.getBoundingClientRect();
//         let newWidth = Math.max(20, mouseX - rect.left - selectedImage.x);
//         let newHeight = newWidth / aspectRatio;

//         // Constrain newWidth and newHeight to not exceed the container's dimensions
//         if (newWidth > container.w) {
//             newWidth = container.w;
//             newHeight = newWidth / aspectRatio;
//         }
//         if (newHeight > container.h) {
//             newHeight = container.h;
//             newWidth = newHeight * aspectRatio;
//         }

//         const updatedImages = localImages.map((img) =>
//             img.id === selectedId
//                 ? { ...img, w: newWidth, h: newHeight }
//                 : img
//         );

//         // Update maxY if needed
//         const newMaxY = updatedImages.reduce(
//             (acc, img) => Math.max(acc, img.y + img.h),
//             0
//         );
//         setMaxY(newMaxY);

//         return updatedImages;
//     }
//     return null;
// };

// const repositionImages = (_images: ImageData[]): ImageData[] => {
//     console.log("repositioning images", container.margin.left);

//     const { _localImages } = positionImages(_images, container);

//     return _localImages;
// };

//     const handleMouseUp = () => {
//         setIsResizing(false);
//         // Call the function to reposition images after resizing
//         const repositionedImages = repositionImages(localImages);
//         setLocalImages(repositionedImages);
//         setImages(repositionedImages);
//     };

//     useEffect(() => {
//         window.addEventListener("mousemove", handleMouseMove);
//         window.addEventListener("mouseup", handleMouseUp);
//         window.addEventListener("touchmove", handleTouchMove); // Add this
//         window.addEventListener("touchend", handleMouseUp); // Add this

//         return () => {
//             window.removeEventListener("mousemove", handleMouseMove);
//             window.removeEventListener("mouseup", handleMouseUp);
//             window.removeEventListener("touchmove", handleTouchMove); // Add this
//             window.removeEventListener("touchend", handleMouseUp); // Add this
//         };
//     }, [localImages, selectedId, isResizing]);

// const [isDraggingMargin, setIsDraggingMargin] = useState(false);

// const handleMarginDragStart = (e: any) => {
//     setIsDraggingMargin(true);
// };

// const handleMarginDrag = (e: any) => {
//     if (!isDraggingMargin || !containerRef.current) return;

//     const clientX = e.type.includes("touch")
//         ? e.touches[0].clientX
//         : e.clientX;
//     const rect = containerRef.current.getBoundingClientRect();
//     let newMarginLeft = clientX - rect.left;

//     // Constrain the margin value
//     newMarginLeft = Math.max(0, newMarginLeft);
//     newMarginLeft = Math.min(newMarginLeft, container.w - 20); // Assuming a minimum container width

//     setContainer({
//         ...container,
//         margin: {
//             ...container.margin,
//             left: newMarginLeft / container.scaleFactor,
//         },
//     });
// };

// const handleMarginDragEnd = () => {
//     // repositionImages(localImages);
//     setIsDraggingMargin(false);
// };

// useEffect(() => {
//     console.log("margin changed", container.margin.left);

//     repositionImages(localImages);
// }, [container.margin]);

// useEffect(() => {
//     if (isDraggingMargin) {
//         window.addEventListener("mousemove", handleMarginDrag);
//         window.addEventListener("mouseup", handleMarginDragEnd);
//         window.addEventListener("touchmove", handleMarginDrag);
//         window.addEventListener("touchend", handleMarginDragEnd);
//     }

//     return () => {
//         window.removeEventListener("mousemove", handleMarginDrag);
//         window.removeEventListener("mouseup", handleMarginDragEnd);
//         window.removeEventListener("touchmove", handleMarginDrag);
//         window.removeEventListener("touchend", handleMarginDragEnd);
//     };
// }, [isDraggingMargin]);

//     return (
//         <div>
// <div className="mb-10 border-t border-b">
//     {/* margin controls */}
//     <div>Margin: </div>
//     <label>
//         Top:
//         <input
//             type="number"
//             value={container.margin.top}
//             onChange={(e) => handleMarginChange(e, "top")}
//         />
//     </label>
//     <label>
//         Right:
//         <input
//             type="number"
//             value={container.margin.right}
//             onChange={(e) => handleMarginChange(e, "right")}
//         />
//     </label>
//     <label>
//         Bottom:
//         <input
//             type="number"
//             value={container.margin.bottom}
//             onChange={(e) => handleMarginChange(e, "bottom")}
//         />
//     </label>
//     <label>
//         Left:
//         <input
//             type="number"
//             value={container.margin.left}
//             onChange={(e) => handleMarginChange(e, "left")}
//         />
//     </label>
// </div>

//             <div
//                 ref={containerRef}
//                 style={{
//                     width: container.w * container.scaleFactor,
//                     height: (maxY + 5) * container.scaleFactor,
//                     border: "1px solid black",
//                     position: "relative",
//                 }}
//                 className="ml-5 bg-white "
//             >
// {/* left margin handle  */}
// <div
//     className="absolute w-5 h-5 -translate-x-1/2 bg-blue-500 cursor-pointer -top-5"
//     style={{
//         left: container.margin.left * container.scaleFactor,
//     }}
//     onMouseDown={handleMarginDragStart}
//     onTouchStart={handleMarginDragStart}
// ></div>
//                 {localImages.map((imgData, index) => {
//                     const imageUrl = imageUrls.get(imgData.id) || "";

//                     return (
//                         <div
//                             key={imgData.id}
//                             data-id={imgData.id}
//                             style={{
//                                 position: "absolute",
//                                 left: imgData.x * container.scaleFactor,
//                                 top: imgData.y * container.scaleFactor,
//                                 width: imgData.w * container.scaleFactor,
//                                 height: imgData.h * container.scaleFactor,
//                                 backgroundImage: `url(${imageUrl})`,
//                                 backgroundSize: "cover",
//                                 border:
//                                     selectedId === imgData.id
//                                         ? "2px solid blue"
//                                         : "none",
//                                 // overflow: "hidden",
//                             }}
//                             onMouseDown={(e) => handleMouseDown(e, imgData)}
//                             onTouchStart={(e) => handleMouseDown(e, imgData)}
//                         >
//                             {selectedId === imgData.id && (
//                                 <div
//                                     className="resize-handle" // Add this class
//                                     style={{
//                                         position: "absolute",
//                                         right: -4,
//                                         bottom: -4,
//                                         width: 16,
//                                         height: 16,
//                                         backgroundColor: "white",
//                                         cursor: "se-resize",
//                                         border: "1px solid blue",
//                                     }}
//                                 ></div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default ResizingWindow;
