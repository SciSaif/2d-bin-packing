import { BinPacker } from "./binPacker";
import Configuration, { Dimension, UnpackedRect } from "./configuration";
import { getResult } from "./util";
export const pack = (rects: UnpackedRect[], container_size: Dimension) => {
    // const rects = cat1_p1;

    const C = new Configuration(
        container_size,
        [...rects] // Using spread operator to create a shallow copy
    );

    const packer = new BinPacker(C);

    const packedConfig = packer.PackConfiguration(C);

    return getResult(packedConfig);
};
