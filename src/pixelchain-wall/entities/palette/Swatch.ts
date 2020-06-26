import { SwatchIndex } from "./MultiplayerPalette"
import { ColorHex, Global } from "../../Global"
import { Materials } from "../Materials"
import { showInput, showMessage } from "../../ui/Modals"
import { playSound } from "../../sounds/Sounds"

export class Swatch extends Entity {

    private color: ColorHex

    constructor(private readonly index: SwatchIndex, onSwatchChangeListener: (color: ColorHex) => void) {
        super()
        const x = ((index % 4) + 1) / 6 - 0.415
        const y = Math.floor(index / 4) * -0.16 + 0.25
        this.addComponent(new Transform({ position: new Vector3(x, y, -0.001), scale: new Vector3(0.16, 0.16, 0.1) }))
        this.addComponent(new OnPointerDown(({ buttonId }) => {
            if (buttonId === 1) {
                // Pick color
                Global.currentIndex = this.index
                playSound()
            } else if (buttonId === 2) {
                // Change swatch
                showInput('PLEASE INSERT A COLOR (HEX)', 'COLOR:', this.color, (text) => {
                    let color = text.trim()
                    if (color.substr(0, 1) !== '#') {
                        color = '#' + color
                    }
                    color = color.slice(0, 7)
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                        this.setColor(color)
                        Global.currentIndex = this.index
                        onSwatchChangeListener(color)
                    } else {
                        showMessage('ERROR', 'THE ENTERED COLOR WAS INVALID', 3000)
                    }
                })
            }
        },
        { button: ActionButton.ANY, hoverText: 'E - Pick Color\nF - Change Swatch' }))
    }

    public setColor(color: ColorHex) {
        this.color = color
        this.addComponentOrReplace(Materials.setForIndex(this.index, color))
    }

    public setVisible() {
        this.addComponentOrReplace(new BoxShape())
    }
}