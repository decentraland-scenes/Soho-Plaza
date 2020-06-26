
import { MultiplayerEntity } from "../MultiplayerEntity"
import { Swatch } from "./Swatch"
import { ColorHex } from "../../Global"
import { Materials } from "../Materials"

const DEFAULT_COLORS: ColorHex[] = [
    `#E4A672`,
    `#B86F50`,
    `#743F39`,
    `#3F2832`,
    `#9E2835`,
    `#E53B44`,
    `#FB922B`,
    `#FFE762`,
    `#63C64D`,
    `#327345`,
    `#193D3F`,
    `#4F6781`,
    `#AFBFD2`,
    `#2CE8F4`,
    `#0484D1`,
    `#FFFFFF`,
]

export class MultiplayerPalette extends MultiplayerEntity<SwatchIndex, ColorHex, ColorHex[]> {

    private colors: ColorHex[]
    private swatches: Swatch[]

    constructor() {
        super('palette')
        this.addComponent(new PlaneShape())
        this.addComponent(Materials.buildMaterial('#666666'))
        engine.addEntity(this)
    }

    protected runInitialLoad(): void {
        this.swatches = []
        for (let i = 0; i < DEFAULT_COLORS.length; i++) {
            const swatch = new Swatch(i, (color => this.changeEntity(i, color)))
            swatch.setParent(this)
            engine.addEntity(swatch)
            this.swatches[i] = swatch
        }
    }

    protected getFullStateDefaults(): ColorHex[] {
        return DEFAULT_COLORS
    }

    protected initializeWithFullState(fullState: ColorHex[]): void {
        this.colors = fullState
        for (let i = 0; i < fullState.length; i++) {
            this.swatches[i].setColor(this.colors[i])
        }
    }

    public getFullStateToShare(): ColorHex[] | undefined {
        return this.colors
    }

    protected onChange(changeIdentifier: SwatchIndex, changeValue: ColorHex): void {
        this.colors[changeIdentifier] = changeValue
        this.swatches[changeIdentifier].setColor(changeValue)
    }

    protected setAsVisible(): void {
        for (const swatch of this.swatches) {
            swatch.setVisible()
        }
    }
}

export type SwatchIndex = number