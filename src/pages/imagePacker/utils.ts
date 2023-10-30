import jsPDF from "jspdf";
import { Box } from "./ImagePacker";
import Konva from "konva";
export const handleSaveAsPDF = ({
    boxes,
    containerWidth,
    containerHeight,
}: {
    containerWidth: number;
    containerHeight: number;
    boxes: Box[][];
}) => {
    const pdf = new jsPDF("p", "pt", "a4");
    pdf.setTextColor("#000000");

    const a4Width = 595; // A4 width in points
    const a4Height = 842; // A4 height in points

    const scaleX = a4Width / containerWidth;
    const scaleY = a4Height / containerHeight;

    boxes.forEach((boxSet, index) => {
        if (index > 0) {
            pdf.addPage("a4", "portrait");
        }

        const stage = new Konva.Stage({
            container: "temp-container",
            width: containerWidth,
            height: containerHeight,
        });

        const layer = new Konva.Layer();
        stage.add(layer);

        boxSet.forEach((box) => {
            if (box.image) {
                const konvaImage = new Konva.Image({
                    x: box.x,
                    y: box.y,
                    width: box.rotated ? box.h : box.w,
                    height: box.rotated ? box.w : box.h,
                    image: box.image,
                    rotation: box.rotated ? -90 : 0,
                    offsetX: box.rotated ? box.h : 0,
                });
                layer.add(konvaImage);
            }

            const rect = new Konva.Rect({
                x: box.x,
                y: box.y,
                width: box.w,
                height: box.h,
                stroke: "red",
            });
            layer.add(rect);
        });

        pdf.addImage(
            stage.toDataURL({ pixelRatio: 2 }),
            0,
            0,
            containerWidth * scaleX,
            containerHeight * scaleY
        );

        stage.destroy();
    });

    pdf.save("packed-images.pdf");
};
