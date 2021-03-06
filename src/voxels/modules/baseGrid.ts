import { Manager, Mode, materials } from '../manager'
import { voxels, Voxel, VOXEL_SIZE } from './voxel'
import resources from '../resources'
import { picker } from './picker'

// Adds a voxel to the scene
const voxelShape = new BoxShape()
export const baseGridHeight = 1.37

function addBaseVoxel(x: number, y: number, z: number) {
  log('Voxel added')
  Manager.playAddVoxelSound()

  const voxel = new Voxel(
    voxelShape,
    new Transform({
      position: new Vector3(x, y, z),
      scale: new Vector3(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE),
    })
  )
  voxels.push(voxel)
  voxel.addComponent(materials[Manager.colorIndex])
}

export function buildBaseGrid() {
  // Base grid
  const baseGrid = new Entity()
  baseGrid.addComponent(resources.models.baseGrid)
  baseGrid.addComponent(
    new Transform({
      // position: new Vector3(218.835, baseGridHeight, 153.812),
      position: new Vector3(219, baseGridHeight, 154),
    })
  )
  baseGrid.addComponent(
    new OnPointerDown(
      (e) => {
        if (Manager.activeMode == Mode.Add) {
          let transform = picker.getComponent(Transform).position
          addBaseVoxel(
            transform.x,
            VOXEL_SIZE / 2 + 0.1 + baseGridHeight, // Offset voxel based on grid thickness (0.1m) and height
            transform.z
          )
        }
      },
      {
        button: ActionButton.POINTER,
        showFeedback: false,
      }
    )
  )
  engine.addEntity(baseGrid)
}

// buildBaseGrid()
