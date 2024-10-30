import React, { useEffect, useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop';
import { ImageBox } from '../../pages/pack/Pack';
import { useAppDispatch } from '../../redux/hooks';
import { setFilesChangedFlag } from '../../redux/features/slices/mainSlice';
import 'react-image-crop/dist/ReactCrop.css'
import Button from '../Button';
import LabelInput from '@/components/LabelInput';
import { createImages } from '@/utils';

type CreateDuplicateProps = {
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    id: string;
    close: () => void;
}

const CreateDuplicateModal = (
    { images, setImages, id, close }: CreateDuplicateProps
) => {
    const [count, setCount] = useState<number>(1);


    const handleCreateDuplicates = async () => {
        // get the image to duplicate
        const image = images.find((image) => image.id === id);
        if (!image) return;

        const newImages = await createImages(new Array(count).fill(image.file), { size: { width: image.w, height: image.h } });
        setImages([...images, ...newImages]);
        close();

    }
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
                <h1 className="mb-5 text-lg font-semibold">Create Duplicates</h1>
                <LabelInput
                    type="number"
                    label="count"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                />


                <div className="flex justify-end mt-4">
                    <button
                        onClick={close}
                        className="px-4 py-2 mr-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleCreateDuplicates}
                        className="px-4 py-2 text-white rounded bg-secondary-700 hover:bg-secondary-800"
                    >
                        Create
                    </Button>
                </div>
            </div>
        </div>
    );


}

export default CreateDuplicateModal