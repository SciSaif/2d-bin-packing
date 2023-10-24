import { BinPacker } from "./binPacker";
import { cat1_p1, cat1_p1_0 } from "./testcases";
import Configuration from "./configuration";
import { plotConfiguration } from "./util";
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
    return plotConfiguration(packedConfig);
};
