import { ContainerType } from "@/redux/features/slices/mainSlice";

export interface PaperSize {
    name: string;
    width: number;
    height: number;
    widthInMm: number;
}

export const A4: PaperSize = {
    name: "A4",
    width: 595,
    height: 842,
    widthInMm: 210,
};

export const Letter: PaperSize = {
    name: "Letter",
    width: 612,
    height: 792,
    widthInMm: 215.9,
};
export const A3: PaperSize = {
    name: "A3",
    width: 842,
    height: 1191,
    widthInMm: 297,
};

export const Legal: PaperSize = {
    name: "Legal",
    width: 612,
    height: 1008,
    widthInMm: 215.9,
};

export const Executive: PaperSize = {
    name: "Executive",
    width: 521,
    height: 756,
    widthInMm: 184.2,
};

export const A5: PaperSize = {
    name: "A5",
    width: 420,
    height: 595,
    widthInMm: 148.5,
};

export const B5: PaperSize = {
    name: "B5",
    width: 498,
    height: 708,
    widthInMm: 176.2,
};

export const paperSizes: Record<string, PaperSize> = {
    A4,
    A3,
    Letter,
    Legal,
    Executive,
    A5,
    B5,
};

export const photoSizes = {
    Passport: {
        description: "Standard passport photo size",
        widthMm: 35,
        heightMm: 45,
    },
    Visa: {
        description: "Common visa photo size",
        widthMm: 50,
        heightMm: 50,
    },
    "2x2 inch": {
        description: "Square format used in some documents",
        widthMm: 50.8, // 2 inches in mm
        heightMm: 50.8,
    },
} as const;

export type PhotoSizeDefinition = (typeof photoSizes)[keyof typeof photoSizes];

export function getPhotoSizeInPixels(
    photoSize: PhotoSizeDefinition,
    container: ContainerType
): { width: number; height: number } {
    const paperSize = container.paperSize;

    // For A-series papers, we know the exact mm size
    // by default 1190 px = 210 mm
    // so 1 mm = 1190 / 210 px
    // so 35 mm = 35 * 1190 / 210 px

    const OneMmInPx = container.w / paperSize.widthInMm;
    const widthInPx = photoSize.widthMm * OneMmInPx;
    const heightInPx = photoSize.heightMm * OneMmInPx;

    return {
        width: widthInPx,
        height: heightInPx,
    };
}
