import { BinPacker } from "./binPacker";
import Configuration from "./configuration";
import { getResult } from "./util";
export const pack = (
    rects: [number, number][],
    container_size: [number, number]
) => {
    // const rects = cat1_p1;

    const C = new Configuration(
        container_size,
        [...rects] // Using spread operator to create a shallow copy
    );

    const packer = new BinPacker(C);

    const packedConfig = packer.PackConfiguration(C);
    return getResult(packedConfig);
};
