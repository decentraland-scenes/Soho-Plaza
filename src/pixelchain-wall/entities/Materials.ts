import { ColorHex } from "../Global"
import { SwatchIndex } from "./palette/MultiplayerPalette"

export class Materials {

    private static materials: any = { }

    static setForIndex(index: SwatchIndex, color: ColorHex) {
        const material: Material = Materials.materials[index]
        if (!material) {
            const newMaterial = this.buildMaterial(color)
            Materials.materials[index] = newMaterial
            return newMaterial
        } else {
            material.albedoColor = Color3.FromHexString(color)
            return material
        }
    }

    static getForIndex(index: SwatchIndex): Material {
        const material = Materials.materials[index]
        if (!material) {
            return this.setForIndex(index, `#FFFFFF`)
        }
        return material
    }

    static buildMaterial(color: ColorHex): Material {
        const material = new Material()
        material.albedoColor = Color3.FromHexString(color)
        material.metallic = 0.2
        material.roughness = 1.0
        return material
    }
}