export class Coord {
    column: number;
    row: number;

    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }

    valueOf() {
        return this.column * Math.pow(2, this.row);
    }

    equals(other: any): boolean {
        if (other instanceof Coord) {
           return other.row === this.row && other.column === this.column;
        }
        return false;
    }

    neighbours(delta: number): Array<Coord> {
       return [
           new Coord(this.row + delta, this.column    ),
           new Coord(this.row    , this.column + delta),
           new Coord(this.row - delta, this.column    ),
           new Coord(this.row    , this.column - delta),
       ]
    }

    add(other: Coord): Coord {
        return new Coord(other.row + this.row, other.column + this.column);
    }

    mul(scalar: number): Coord {
        return new Coord(this.row * scalar, this.column * scalar);
    }

    neg(): Coord {
        return this.mul(-1);
    }

    sub(other: Coord): Coord {
        return this.add(other.neg());
    }

    convertToInternal(): Coord {
        return new Coord(this.row * 2 - 1, this.column * 2 - 1);
    }

    convertToExternal(): Coord {
        return new Coord((this.row + 1) / 2 , (this.column + 1) / 2);
    }
}
