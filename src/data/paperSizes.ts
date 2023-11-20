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

export const Legal: PaperSize = {
    name: "Legal",
    width: 612,
    height: 1008,
};

export const Executive: PaperSize = {
    name: "Executive",
    width: 521,
    height: 756,
};

export const A5: PaperSize = {
    name: "A5",
    width: 420,
    height: 595,
};

export const B5: PaperSize = {
    name: "B5",
    width: 498,
    height: 708,
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
