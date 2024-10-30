import React, { useEffect, useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop';
import { ImageBox } from '../../pages/pack/Pack';
import { useAppDispatch } from '../../redux/hooks';
import { setFilesChangedFlag } from '../../redux/features/slices/mainSlice';
import 'react-image-crop/dist/ReactCrop.css'
import Button from '../Button';
import { createImages } from '@/utils';

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
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
    const [crop, setCrop] = useState<Crop>({ unit: 'px', width: 100, height: 100, x: 0, y: 0 });
    const [selectedImage] = useState<File | null>(images.find((image) => image.id === id)?.file ?? null); // Selected image to crop
    const [croppedFile, setCroppedFile] = useState<File | null>(null);
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
    const [actualImageDimensions, setActualImageDimensions] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        if (selectedImage) {
            // Get actual image dimensions before displaying
            const img = new Image();
            img.onload = () => {
                setActualImageDimensions({
                    width: img.width,
                    height: img.height
                });
            };
            img.src = URL.createObjectURL(selectedImage);

            // Cleanup
            return () => {
                URL.revokeObjectURL(img.src);
            };
        }
    }, [selectedImage]);

    const getCroppedImageFile = (canvas: HTMLCanvasElement, fileName: string): Promise<File> => {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob failed'));
                        return;
                    }
                    const file = new File([blob], fileName, { type: 'image/jpeg' });
                    resolve(file);
                },
                'image/jpeg',
                0.95
            );
        });
    };


    const onCropComplete = async (crop: Crop) => {
        if (!imageRef || !crop.width || !crop.height || !actualImageDimensions)
            return;
        try {
            // Calculate scale based on actual dimensions vs displayed dimensions
            const scaleX = actualImageDimensions.width / imageRef.width;
            const scaleY = actualImageDimensions.height / imageRef.height;

            const canvas = document.createElement('canvas');

            // Use scaled dimensions for the canvas
            canvas.width = Math.round(crop.width * scaleX);
            canvas.height = Math.round(crop.height * scaleY);

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            // temporary canvas to hold the full image
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = actualImageDimensions.width;
            tempCanvas.height = actualImageDimensions.height;
            const tempCtx = tempCanvas.getContext('2d');

            if (!tempCtx) {
                throw new Error('Could not get temp canvas context');
            }

            // Draw the full image on the temporary canvas
            await new Promise<void>((resolve, reject) => {
                const fullImg = new Image();
                fullImg.onload = () => {
                    tempCtx.drawImage(fullImg, 0, 0);
                    resolve();
                };
                fullImg.onerror = reject;
                fullImg.src = URL.createObjectURL(selectedImage!);
            });

            // Draw the cropped portion onto the final canvas
            ctx.drawImage(
                tempCanvas,
                Math.round(crop.x * scaleX),
                Math.round(crop.y * scaleY),
                Math.round(crop.width * scaleX),
                Math.round(crop.height * scaleY),
                0,
                0,
                canvas.width,
                canvas.height
            );

            const croppedFile = await getCroppedImageFile(canvas, selectedImage!.name);
            setCroppedFile(croppedFile);

        } catch (error) {
            console.error('Error during crop:', error);
        }
    };

    const saveCroppedImage = async () => {
        if (croppedFile && selectedImage) {
            const croppedImage = await createImages([croppedFile]);

            // Replace the original image in the array with the cropped image 
            const newImages = images.map((image) =>
                image.file === selectedImage ? croppedImage[0] : image
            );
            setImages(newImages);

            setTimeout(() => {
                dispatch(setFilesChangedFlag());
            }, 0);
            close();
        }
    };

    useEffect(() => {
        if (crop && imageRef && actualImageDimensions) {
            onCropComplete(crop);
        }
    }, [imageRef, actualImageDimensions])

    const handleAspectRatioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === 'free') {
            setAspectRatio(undefined);
        } else {
            setAspectRatio(parseFloat(value));

            setCrop({ unit: 'px', width: 100 * parseFloat(value), height: 100, x: 0, y: 0 });
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
                <div className="mb-4">
                    <label htmlFor="aspect-ratio" className="mr-2">Aspect Ratio:</label>
                    <select
                        id="aspect-ratio"
                        value={aspectRatio ?? 'free'}
                        onChange={handleAspectRatioChange}
                        className="px-2 py-1 border border-gray-300 rounded"
                    >
                        <option value="free">Free</option>
                        <option value="1">1:1 (Square)</option>
                        <option value={4 / 3}>4:3</option>
                        <option value={16 / 9}>16:9</option>
                        <option value={7 / 9}>3.5x4.5  (Passport)</option>
                    </select>
                </div>
                <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={onCropComplete}
                    aspect={aspectRatio}
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