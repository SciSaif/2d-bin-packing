import Rect from "./rect";
import { PointType, plotConfiguration } from "./util";

export default class Configuration {
    private static readonly eps: number = 0.001;
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
    }

    generate_L(): void {
        this.concave_corners = this.getConcaveCorners();
        const ccoas: Rect[] = [];
        for (let [x, y] of this.unpacked_rects) {
            for (let [corner, type] of this.concave_corners) {
                for (let rotated of [false, true]) {
                    const ccoa = new Rect(corner, x, y, type, rotated);
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
        if (sumChecks === 3) {
            const index = checks.findIndex((x) => !x);
            return index as PointType;
        }
        return null;
    }

    checkBoundaries(p: [number, number]): boolean[] {
        return [
            this.contains([p[0] + Configuration.eps, p[1] + Configuration.eps]),
            this.contains([p[0] - Configuration.eps, p[1] + Configuration.eps]),
            this.contains([p[0] + Configuration.eps, p[1] - Configuration.eps]),
            this.contains([p[0] - Configuration.eps, p[1] - Configuration.eps]),
        ];
    }

    contains(point: [number, number]): boolean {
        if (
            point[0] <= 0 ||
            point[1] <= 0 ||
            this.size[0] <= point[0] ||
            this.size[1] <= point[1]
        ) {
            return true;
        }
        for (let r of this.packed_rects) {
            if (r.contains(point)) {
                return true;
            }
        }
        return false;
    }

    fits(ccoa: Rect): boolean {
        if (
            ccoa.origin[0] < 0 ||
            ccoa.origin[1] < 0 ||
            this.size[0] < ccoa.origin[0] + ccoa.width ||
            this.size[1] < ccoa.origin[1] + ccoa.height
        ) {
            return false;
        }
        for (let rect of this.packed_rects) {
            if (ccoa.overlaps(rect)) {
                return false;
            }
        }
        return true;
    }

    placeRect(rect: Rect): void {
        this.packed_rects.push(rect);
        const index = this.unpacked_rects.findIndex(
            ([w, h]) =>
                (w === rect.width && h === rect.height) ||
                (w === rect.height && h === rect.width)
        );
        if (index !== -1) {
            this.unpacked_rects.splice(index, 1);
        }
        this.generate_L();
    }

    density(): number {
        const total_area = this.size[0] * this.size[1];
        const occupied_area = this.packed_rects.reduce(
            (acc, rect) => acc + rect.area,
            0
        );
        return occupied_area / total_area;
    }

    getAllCorners(): [number, number][] {
        const corners: [number, number][] = [
            [0, 0],
            [0, this.size[1]],
            [this.size[0], 0],
            this.size,
        ];
        for (let rect of this.packed_rects) {
            corners.push(
                rect.corner_bot_l,
                rect.corner_bot_r,
                rect.corner_top_l,
                rect.corner_top_r
            );
        }
        // return Array.from(new Set(corners.map(JSON.stringify))).map(JSON.parse);
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
