// paperSizes.ts

export interface PaperSize {
    name: string;
    width: number;
    height: number;
}

export const A4: PaperSize = {
    name: "A4",
    width: 595,
    height: 842,
};

export const Letter: PaperSize = {
    name: "Letter",
    width: 612,
    height: 792,
};
export const A3: PaperSize = {
    name: "A3",
    width: 842,
    height: 1191,
};

// Add more paper sizes as needed

export const paperSizes: Record<string, PaperSize> = {
    A4,
    A3,
    Letter,
    // Add more paper sizes as needed
};
