import { ImageBox } from "@/pages/pack/Pack";
import { ContainerType } from "@/redux/features/slices/mainSlice";

export type AlgorithmProps = {
    images: ImageBox[];
    container: ContainerType;
};
