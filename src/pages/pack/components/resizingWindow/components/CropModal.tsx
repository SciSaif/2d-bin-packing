import React, { useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop';
import { createImages } from '../../../utils';
import { ImageBox } from '../../../Pack';
import { useAppDispatch } from '../../../../../redux/hooks';
import { setFilesChangedFlag } from '../../../../../redux/features/slices/mainSlice';
import 'react-image-crop/dist/ReactCrop.css'
import Button from '../../../../../components/Button';

type CropModalProps = {
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    id: string;
    close: () => void;
}

const CropModal = (
    { images, setImages, id, close }: CropModalProps
) => {
    const dispatch = useAppDispatch();

    const [crop, setCrop] = useState<Crop>({ unit: 'px', width: 100, height: 100, x: 0, y: 0 });
    const [selectedImage, setSelectedImage] = useState<File | null>(images.find((image) => image.id === id)?.file ?? null); // Selected image to crop
    const [croppedFile, setCroppedFile] = useState<File | null>(null);
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);


    // Convert canvas to file
    const getCroppedImageFile = (canvas: HTMLCanvasElement, fileName: string) => {
        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    const croppedFile = new File([blob], fileName, { type: "image/jpeg" });
                    resolve(croppedFile);
                }
            }, "image/jpeg");
        });
    };

    const onCropComplete = async (crop: Crop) => {
        if (imageRef && crop.width && crop.height) {
            const scaleX = imageRef.naturalWidth / imageRef.width;
            const scaleY = imageRef.naturalHeight / imageRef.height;

            // Set the canvas size to match the natural size of the cropped area
            const canvas = document.createElement('canvas');
            canvas.width = crop.width * scaleX;
            canvas.height = crop.height * scaleY;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Draw the cropped image at natural resolution
                ctx.drawImage(
                    imageRef,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width * scaleX,
                    crop.height * scaleY
                );

                // Convert the cropped area to a file
                const croppedFile = await getCroppedImageFile(canvas, selectedImage!.name);
                setCroppedFile(croppedFile);
            }
        }
    };


    const saveCroppedImage = async () => {
        if (croppedFile && selectedImage) {
            const croppedImage = await createImages([croppedFile]);

            // Replace the original image in the array with the cropped image 
            const newImages = images.map((image) =>
                image.file === selectedImage ? croppedImage[0] : image
            );
            setImages(newImages); // Persist the cropped image

            setTimeout(() => {
                dispatch(setFilesChangedFlag());
            }, 0);
            close();
        }
    };
    if (!selectedImage) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div
                className="p-4 bg-white rounded shadow-lg"
                style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={onCropComplete}
                >
                    <div
                        style={{
                            maxWidth: '100%',
                            maxHeight: '80vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Crop"
                            style={{
                                maxHeight: '70vh',
                                objectFit: 'contain',
                            }}
                            onLoad={(e) => setImageRef(e.currentTarget)}
                        />
                    </div>
                </ReactCrop>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={close}
                        className="px-4 py-2 mr-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={saveCroppedImage}
                        className="px-4 py-2 text-white rounded bg-secondary-700 hover:bg-secondary-800"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );


}

export default CropModal