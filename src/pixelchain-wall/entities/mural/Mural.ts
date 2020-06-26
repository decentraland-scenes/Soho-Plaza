
export class Mural<T> {

    private constructor(
        private readonly mural: T[][],
        private readonly width: number,
        private readonly height: number) { }

    getTile(tile: TilePosition): T {
        if (0 <= tile.i && tile.i < this.mural.length && 0 <= tile.j && tile.j < this.mural[tile.i].length) {
            return this.mural[tile.i][tile.j]
        } else {
            throw new Error('Indexes out of bounds')
        }
    }

    getAllTiles(): { pos: TilePosition, value: T }[] {
        const result: { pos: TilePosition, value: T }[] = []
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                result.push({ pos: { i, j }, value: this.mural[i][j] })
            }
        }
        return result
    }

    setTile(tile: TilePosition, color: T) {
        if (0 <= tile.i && tile.i < this.mural.length && 0 <= tile.j && tile.j < this.mural[tile.i].length) {
            this.mural[tile.i][tile.j] = color
        } else {
            throw new Error('Indexes out of bounds')
        }
    }

    getValues(): T[][] {
        return this.mural
    }

    static fromValues<T>(values: T[][]): Mural<T> {
        const width = values.length
        const height = values[0].length
        return new Mural(values, width, height)
    }

    static initializeEmpty<T>(width: number, height: number, startValue?: (position: TilePosition) => T): Mural<T> {
        const result: T[][] = []
        for (let i = 0; i < height; i++) {
            result[i] = new Array<T>(width)
            if (startValue) {
                for (let j = 0; j < width; j++) {
                    result[i][j] = startValue({ i, j })
                }
            }
        }
        return new Mural(result, width, height)
    }

}

export type TilePosition = { i: number, j: number }