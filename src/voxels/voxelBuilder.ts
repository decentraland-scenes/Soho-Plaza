import { Manager, materials, colors, Mode } from './manager'
import { pickerMaterial } from './modules/picker'
import { HUD } from './modules/hud'
import * as utils from '@dcl/ecs-scene-utils'
// import { addVoxels } from './voxels/game'
import { getVoxels } from './modules/serverHandler'
import {
  Voxel,
  VOXEL_SIZE,
  voxels,
  VoxelData,
  voxelData,
} from './modules/voxel'
import { buildBaseGrid } from './modules/baseGrid'
// import { buildBaseGrid } from './modules/baseGrid'

export let inRange: boolean = false

export function addVoxels(): void {
  // UI Elements
  const canvas = new UICanvas()
  const hud = new HUD(canvas)

  // Global button events
  const input = Input.instance

  Object.keys(Mode).length

  input.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (): void => {
    log('E Key Pressed')
    switch (Manager.activeMode) {
      case Mode.Add:
        Manager.activeMode = Mode.Subtract
        hud.switchModeIcon(Mode.Subtract)
        break
      case Mode.Subtract:
        Manager.activeMode = Mode.EyeDrop
        hud.switchModeIcon(Mode.EyeDrop)
        break
      case Mode.EyeDrop:
        Manager.activeMode = Mode.Add
        hud.switchModeIcon(Mode.Add)
        break
      default:
        break
    }

    log('Active Mode: ', Manager.activeMode)
  })

  input.subscribe('BUTTON_DOWN', ActionButton.SECONDARY, false, (): void => {
    log('F Key Pressed')
    Manager.setVoxelColor()
    pickerMaterial.albedoColor = colors[Manager.colorIndex]
    log('Color: ', materials[Manager.colorIndex].albedoColor)

    // Delete function
    // if (highlightedVoxelID != null) {
    //   engine.removeEntity(engine.entities[highlightedVoxelID])
    //   Manager.playSubtractVoxelSound()
    // }

    // Undo function
    // if (voxels.length > 0) {
    //   engine.removeEntity(voxels.pop())
    //   Manager.playSubtractVoxelSound()
    // }

    // Clear function
    // for (let voxel of voxels) {
    //   engine.removeEntity(voxel)
    // }
  })

  /// update voxels periodically

  buildBaseGrid()

  let activeArea = new Entity()
  engine.addEntity(activeArea)
  activeArea.addComponent(
    new Transform({
      position: new Vector3(219, 0.1, 150),
    })
  )

  let triggerBox = new utils.TriggerBoxShape(
    new Vector3(40, 40, 40),
    Vector3.Zero()
  )

  activeArea.addComponent(
    new utils.TriggerComponent(triggerBox, {
      onCameraEnter: () => {
        hud.switchModeIcon(Mode.Add, true)
        Manager.activeMode = Mode.Add
        updateVoxels()
        inRange = true
      },
      onCameraExit: () => {
        hud.switchModeIcon(Mode.None, true)
        //Manager.activeMode = Mode.None
        inRange = false
      },
    })
  )

  let updateHandler = new Entity()
  engine.addEntity(updateHandler)

  updateHandler.addComponent(
    new utils.Interval(10000, async function () {
      if (!inRange) return
      await updateVoxels()
    })
  )
}

async function updateVoxels() {
  let voxelList: VoxelData[] = await getVoxels()

  for (let i = 0; i < voxelList.length; i++) {
    switch (voxelList[i].mode) {
      case Mode.Add:
        const voxel = new Voxel(
          new BoxShape(),
          new Transform({
            position: new Vector3(
              voxelList[i].x,
              voxelList[i].y,
              voxelList[i].z
            ),
            scale: new Vector3(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE),
          })
        )
        voxels.push(voxel)
        voxel.addComponent(materials[voxelList[i].colIndex])
        break
      case Mode.Subtract:
        let voxelName =
          'x' +
          voxelList[i].x.toString() +
          'y' +
          voxelList[i].y.toString() +
          'z' +
          voxelList[i].z.toString()

        engine.removeEntity(engine.entities[voxelName])
        break
    }
  } //else third mode?????
}
