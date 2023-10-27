import Rect from "./rect";
import { PointType } from "./util";

export default class Configuration {
    private static readonly eps: number = 0.001; //The amount to look in each direction when determining if a corner is concave
    size: [number, number];
    unpacked_rects: [number, number][];
    packed_rects: Rect[];
    L: Rect[] = [];
    concave_corners: [[number, number], PointType][] = [];

    constructor(
        size: [number, number],
        unpacked_rects: [number, number][],
        packed_rects: Rect[] = []
    ) {
        this.size = size;
        this.unpacked_rects = unpacked_rects;
        this.packed_rects = packed_rects;
        this.generate_L();
        console.log("total ccoas", this.L.length);
    }

    //   """
    //     A function that takes the current configuration, all the remaining rects and returns all
    //     possible CCOAs that can be fitted to the configuration
    //     Parameters
    //     ----------
    //     C: Configuration, required
    //         The current configuration

    //     remaining_rects: list[tuple], required:
    //         The dimensions of the rects yet to be packed. On the format: [w,h]
    //     """
    generate_L(): void {
        // 1. concave corners
        this.concave_corners = this.getConcaveCorners();
        // 2. generate ccoas for every rect
        const ccoas: Rect[] = [];
        for (let [x, y] of this.unpacked_rects) {
            for (let [corner, type] of this.concave_corners) {
                for (let rotated of [false, true]) {
                    const ccoa = new Rect(corner, x, y, type, rotated);
                    // 3. Add if it fits
                    if (this.fits(ccoa)) {
                        ccoas.push(ccoa);
                    }
                }
            }
        }
        this.L = ccoas;
    }

    getConcaveCorners(): [[number, number], PointType][] {
        const concave_corners: [[number, number], PointType][] = [];
        for (let corner of this.getAllCorners()) {
            const corner_type = this.getCornerType(corner);
            if (corner_type !== null) {
                concave_corners.push([corner, corner_type]);
            }
        }
        return concave_corners;
    }

    getCornerType(p: [number, number]): PointType | null {
        const checks = this.checkBoundaries(p);
        const sumChecks = checks.reduce((acc, val) => acc + (val ? 1 : 0), 0);
        // exactly 3 checks must be true for the point to be concave
        if (sumChecks === 3) {
            const index = checks.findIndex((x) => !x);
            return index as PointType;
        }
        return null;
    }

    checkBoundaries(p: [number, number]): boolean[] {
        // check
        return [
            this.contains([p[0] + Configuration.eps, p[1] + Configuration.eps]),
            this.contains([p[0] - Configuration.eps, p[1] + Configuration.eps]),
            this.contains([p[0] + Configuration.eps, p[1] - Configuration.eps]),
            this.contains([p[0] - Configuration.eps, p[1] - Configuration.eps]),
        ];
    }

    // checks if a point is inside any of the rects
    contains(point: [number, number]): boolean {
        // Check if the point is out of bounds
        if (
            point[0] <= 0 ||
            point[1] <= 0 ||
            this.size[0] <= point[0] ||
            this.size[1] <= point[1]
        ) {
            return true;
        }

        // Check if the point is inside any of the rects
        for (let r of this.packed_rects) {
            if (r.contains(point)) {
                return true;
            }
        }
        return false;
    }

    //   Returns true if a given ccoa fits into the configuration without overlapping any of the rects
    //   or being out of bounds
    fits(ccoa: Rect): boolean {
        // Check if the ccoa is out of bounds in any way

        if (
            ccoa.origin[0] < 0 ||
            ccoa.origin[1] < 0 ||
            this.size[0] < ccoa.origin[0] + ccoa.width ||
            this.size[1] < ccoa.origin[1] + ccoa.height
        ) {
            return false;
        }
        // Check if the rect overlaps any of the already packed rects
        for (let rect of this.packed_rects) {
            if (ccoa.overlaps(rect)) {
                return false;
            }
        }
        return true;
    }

    placeRect(rect: Rect): void {
        // Add rect to packed rects
        this.packed_rects.push(rect);

        // Remove the rect from unpacked rects
        const index = this.unpacked_rects.findIndex(
            ([w, h]) =>
                (w === rect.width && h === rect.height) ||
                (w === rect.height && h === rect.width)
        );
        if (index !== -1) {
            this.unpacked_rects.splice(index, 1);
        }
        this.generate_L(); // TODO: Do somehing like passing the just placed rect for more efficiency
    }

    // Return the percentage of total container area filled by packed rects
    density(): number {
        const total_area = this.size[0] * this.size[1];
        const occupied_area = this.packed_rects.reduce(
            (acc, rect) => acc + rect.area,
            0
        );
        return occupied_area / total_area;
    }

    getAllCorners(): [number, number][] {
        // container corners
        const corners: [number, number][] = [
            [0, 0],
            [0, this.size[1]],
            [this.size[0], 0],
            this.size,
        ];

        // rect corners
        for (let rect of this.packed_rects) {
            corners.push(
                rect.corner_bot_l,
                rect.corner_bot_r,
                rect.corner_top_l,
                rect.corner_top_r
            );
        }

        // remove duplicates
        return Array.from(
            new Set(corners.map((corner) => JSON.stringify(corner)))
        ).map((str) => JSON.parse(str));
    }

    isSuccessful(): boolean {
        return this.unpacked_rects.length === 0;
    }

    clone(): Configuration {
        const cloned = new Configuration(
            this.size,
            [...this.unpacked_rects],
            [...this.packed_rects]
        );
        cloned.L = [...this.L];
        cloned.concave_corners = [...this.concave_corners];
        return cloned;
    }
}
