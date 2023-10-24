import { PointType } from "./util";

export default class Rect {
    origin: [number, number];
    width: number;
    height: number;
    rotated: boolean;
    bottom: number;
    top: number;
    left: number;
    right: number;
    corner_bot_l: [number, number];
    corner_top_l: [number, number];
    corner_top_r: [number, number];
    corner_bot_r: [number, number];

    constructor(
        origin: [number, number],
        width: number,
        height: number,
        origin_type: PointType = PointType.BOTTOM_LEFT,
        rotated: boolean = false
    ) {
        if (rotated) {
            [height, width] = [width, height];
        }

        switch (origin_type) {
            case PointType.BOTTOM_LEFT:
                this.origin = origin;
                break;
            case PointType.TOP_LEFT:
                this.origin = [origin[0], origin[1] - height];
                break;
            case PointType.BOTTOM_RIGHT:
                this.origin = [origin[0] - width, origin[1]];
                break;
            case PointType.TOP_RIGHT:
                this.origin = [origin[0] - width, origin[1] - height];
                break;
        }

        this.width = width;
        this.height = height;
        this.rotated = rotated;

        this.bottom = this.origin[1];
        this.top = this.origin[1] + this.height;
        this.left = this.origin[0];
        this.right = this.origin[0] + this.width;

        this.corner_bot_l = [this.left, this.bottom];
        this.corner_top_l = [this.left, this.top];
        this.corner_top_r = [this.right, this.top];
        this.corner_bot_r = [this.right, this.bottom];
    }

    get area(): number {
        return this.width * this.height;
    }

    contains(point: [number, number]): boolean {
        return (
            this.corner_bot_l[0] <= point[0] &&
            this.corner_bot_l[1] <= point[1] &&
            point[0] <= this.corner_top_r[0] &&
            point[1] <= this.corner_top_r[1]
        );
    }

    min_distance(other: Rect): number {
        const outer_left = Math.min(this.left, other.left);
        const outer_right = Math.max(this.right, other.right);
        const outer_bottom = Math.min(this.bottom, other.bottom);
        const outer_top = Math.max(this.top, other.top);

        const outer_width = outer_right - outer_left;
        const outer_height = outer_top - outer_bottom;

        const inner_width = Math.max(0, outer_width - this.width - other.width);
        const inner_height = Math.max(
            0,
            outer_height - this.height - other.height
        );

        return Math.sqrt(inner_width ** 2 + inner_height ** 2);
    }

    overlaps(other: Rect): boolean {
        if (this.right <= other.left || other.right <= this.left) {
            return false;
        }
        if (this.top <= other.bottom || other.top <= this.bottom) {
            return false;
        }
        return true;
    }

    *[Symbol.iterator]() {
        yield this.corner_bot_l;
        yield this.corner_top_l;
        yield this.corner_top_r;
        yield this.corner_bot_r;
    }

    toString(): string {
        return `R = ((${this.origin[0]}, ${this.origin[1]}), w=${this.width}, h=${this.height}, r=${this.rotated})`;
    }
}
