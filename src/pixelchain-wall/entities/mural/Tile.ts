import { TILE_SIZE, GAP_BETWEEN_TILES, MURAL_SIZE } from '../../Config'
import { TilePosition } from './Mural'
import { Materials } from '../Materials'
import { Global } from '../../Global'
import { playSound } from '../../sounds/Sounds'
import { SwatchIndex } from '../palette/MultiplayerPalette'

// Shape
const boxShape = new BoxShape()
boxShape.withCollisions = false

export class Tile extends Entity {

    constructor(position: TilePosition, onClickListener: (index: SwatchIndex) => void) {
        super()
        const xPosition = position.j * (TILE_SIZE + GAP_BETWEEN_TILES)
        const yPosition = (MURAL_SIZE - position.i) * (TILE_SIZE + GAP_BETWEEN_TILES)
        const transform = new Transform({ position: new Vector3(xPosition, yPosition, 0), scale: new Vector3(TILE_SIZE, TILE_SIZE, 0.125) })
        this.addComponent(transform)

        this.addComponent(new OnPointerDown(() => {
            // Play sound
            playSound()

            // Update this tile
            this.setIndex(Global.currentIndex)

            // Call listener
            onClickListener(Global.currentIndex)
        },
        {
            button: ActionButton.POINTER,
            hoverText: 'Paint'
        }))
    }

    public setVisible(): void {
        this.addComponent(boxShape)
    }

    public setIndex(index: SwatchIndex): void {
        this.addComponentOrReplace(Materials.getForIndex(index))
    }
}