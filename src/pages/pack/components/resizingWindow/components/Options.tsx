import { Crop, EllipsisVerticalIcon, File, Images, Trash } from "lucide-react";
import { useState } from "react";
import CropModal from "./CropModal";
import { ImageBox } from "../../../Pack";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { clearFileInput } from "@/utils";
import CreateDuplicateModal from "./CreateDuplicatesModal";
import ViewModal from "./ViewModal";

type OptionsProps = {
    id: string;
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    imageUrl: string;
}

const Options = (
    { id, images, setImages, imageUrl, }: OptionsProps
) => {
    const [showCropModal, setShowCropModal] = useState(false);
    const [showCreateDuplicateModal, setShowCreateDuplicateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    const removeImage = () => {
        const newTotalImages = images.length - 1;
        setImages(images.filter((image) => image.id !== id));

        // if all images are removed, reset the state
        if (newTotalImages === 0) {
            clearFileInput();
        }
    };
    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: 25,
            }}
            className="options    rounded   md:w-[16px] md:h-[16px] "
        >


            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-1 py-1 text-black bg-white border rounded-none rounded-br shadow h-fit ">
                        <EllipsisVerticalIcon size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="p-0 w-42">
                    <DropdownMenuItem>
                        <Button
                            variant={"ghost"}
                            className="flex flex-row items-center justify-start w-full gap-2 py-0"
                            onClick={() => setShowViewModal(true)}
                        >
                            <File size={16} /> Compare with paper size
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button
                            variant={"ghost"}
                            className="flex flex-row items-center justify-start w-full gap-2 py-0"
                            onClick={() => setShowCreateDuplicateModal(true)}
                        >
                            <Images size={16} /> Create duplicates

                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button
                            variant={"ghost"}
                            className="flex flex-row items-center justify-start w-full gap-2 py-0"
                            onClick={() => setShowCropModal(true)}
                        >
                            <Crop size={16} /> Crop

                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button
                            variant={"destructive"}
                            className="flex flex-row items-center justify-start w-full gap-2 py-0"
                            onClick={removeImage}
                        >
                            <Trash size={16} /> Delete

                        </Button>
                    </DropdownMenuItem>


                </DropdownMenuContent>
            </DropdownMenu>
            {
                showCropModal && <CropModal id={id} images={images} setImages={setImages} close={() => setShowCropModal(false)} />
            }
            {
                showCreateDuplicateModal && <CreateDuplicateModal id={id} images={images} setImages={setImages} close={() => setShowCreateDuplicateModal(false)} />
            }
            {
                showViewModal && <ViewModal id={id} images={images} close={() => setShowViewModal(false)} imageUrl={imageUrl} />
            }

        </div>
    )
}

export default Options