import jsPDF from "jspdf";
// import { Box } from "./ImagePacker";
import { v4 as uuidv4 } from "uuid";
import { ImageBox } from "./pages/pack/Pack";
import { ContainerType } from "./redux/features/slices/mainSlice";
import html2canvas from "html2canvas";
import printJS from "print-js";

const makePDF = async (boxes: ImageBox[][], container: ContainerType) => {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [container.w, container.h],
    });

    for (let i = 0; i < boxes.length; i++) {
        const page = document.getElementById(`page-${i}`);

        if (page) {
            const canvas = await html2canvas(page, { scale: 2.5 });
            const imgData = canvas.toDataURL("image/png");

            pdf.addImage(imgData, "PNG", 0, 0, container.w, container.h);

            if (i < boxes.length - 1) {
                pdf.addPage([container.w, container.h]);
            }
        }
    }

    return pdf;
};

export type PrintAndSaveProps = {
    boxes: ImageBox[][];
    container: ContainerType;
};

export const saveAsPDF = async ({ boxes, container }: PrintAndSaveProps) => {
    const pdf = await makePDF(boxes, container);

    // Save the PDF file
    pdf.save("packed_images.pdf");
    return pdf;
};

export const printPages = async ({ boxes, container }: PrintAndSaveProps) => {
    const pdf = await makePDF(boxes, container);

    // Print the PDF file
    printJS({ printable: pdf.output("bloburl"), type: "pdf", showModal: true });
};

// function to create the images from files
export const createImages = async (
    files: File[],
    options?: {
        size: { width: number; height: number };
    }
) => {
    // const files = Array.from(fileList);
    const newImages: ImageBox[] = await Promise.all(
        files.map((file) => {
            return new Promise<ImageBox>((resolve) => {
                const img = new Image();
                const id = uuidv4();
                img.onload = () => {
                    resolve({
                        id,
                        w: options?.size.width ?? img.width,
                        h: options?.size.height ?? img.height,
                        x: 0,
                        y: 0,
                        file,
                        new: true,
                    });
                };
                img.src = URL.createObjectURL(file);
            });
        })
    );

    return newImages;
};

export const clearFileInput = () => {
    // clear value of file input
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
        fileInput.value = "";
    }
};
