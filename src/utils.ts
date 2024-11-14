import jsPDF from "jspdf";
// import { Box } from "./ImagePacker";
import { v4 as uuidv4 } from "uuid";
import { ImageBox } from "./pages/pack/Pack";
import { ContainerType } from "./redux/features/slices/mainSlice";
import html2canvas from "html2canvas";

export type SaveAsPDFProps = {
    boxes: ImageBox[][];
    container: ContainerType;
};

export const saveAsPDF = async ({ boxes, container }: SaveAsPDFProps) => {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [container.w, container.h],
    });

    // Iterate through each box set to create individual pages in the PDF
    for (let i = 0; i < boxes.length; i++) {
        const page = document.getElementById(`page-${i}`);

        if (page) {
            // Use html2canvas to take a snapshot of the page content
            const canvas = await html2canvas(page, { scale: 2.5 });
            const imgData = canvas.toDataURL("image/png");

            // Add the captured image to the PDF as a new page
            pdf.addImage(imgData, "PNG", 0, 0, container.w, container.h);

            // Add a new page in the PDF if this is not the last page
            if (i < boxes.length - 1) {
                pdf.addPage([container.w, container.h]);
            }
        }
    }

    // Save the PDF file
    pdf.save("packed_images.pdf");
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
