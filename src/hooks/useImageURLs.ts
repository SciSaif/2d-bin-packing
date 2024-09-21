import { useEffect, useState } from "react";
import { ImageBox } from "../pages/pack/Pack";

const useImageURLs = (images: ImageBox[]) => {
    const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        if (!images) return;
        const newImageUrls = new Map<string, string>();
        images.forEach((image) => {
            if (image.file && !imageUrls.get(image.id)) {
                const url = URL.createObjectURL(image.file);
                newImageUrls.set(image.id, url);
                // Cleanup the object URL when the component unmounts
                // return () => URL.revokeObjectURL(url);
            }
        });
        setImageUrls(newImageUrls);
    }, [images]);

    return imageUrls;
};

export default useImageURLs;
