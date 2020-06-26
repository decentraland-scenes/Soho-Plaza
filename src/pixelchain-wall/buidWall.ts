import { MultiplayerPalette } from './entities/palette/MultiplayerPalette'
import { MultiplayerMural } from './entities/mural/MultiplayerMural'
import { PublishButton } from './entities/publisher/PublishButton'
import { setTimeout, addOneTimeTrigger } from './Utils'

export function buildWall() {
  let scene = new Entity()
  engine.addEntity(scene)

  // Add palette wall
  const paletteWall: Entity = new Entity()
  paletteWall.addComponent(new GLTFShape('models/pixelchain/palette-wall.glb'))
  paletteWall.addComponent(
    new Transform({
      position: new Vector3(248, 0, 15),
      rotation: Quaternion.Euler(0, -135 + 90, 0),
    })
  )
  paletteWall.setParent(scene)
  engine.addEntity(paletteWall)

  // Palette
  const palette = new MultiplayerPalette()
  palette.addComponent(
    new Transform({
      position: new Vector3(0, 1.77, 0),
      rotation: Quaternion.Euler(0, 90, 0),
    })
  )
  palette.setParent(paletteWall)

  // Add wall for mural
  const wall: Entity = new Entity()
  wall.addComponent(new GLTFShape('models/pixelchain/graffiti-wall.glb'))
  wall.addComponent(
    new Transform({
      position: new Vector3(250.89, 0, 14),
      rotation: Quaternion.Euler(0, 90, 0),
    })
  )
  engine.addEntity(wall)

  // Add mural
  const mural: MultiplayerMural = new MultiplayerMural()
  mural.addComponent(
    new Transform({
      position: new Vector3(249.25, 0.45, 14), // Mural position
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  mural.setParent(scene)
  engine.addEntity(mural)

  // Add publish button
  const button = new PublishButton(mural, palette)
  button.addComponent(new Transform({}))
  button.setParent(paletteWall)

  // We have to split the loading process into different parts, so that the scene can load fast,
  // and also users don't see the mural loading for too much time

  // Initialize the entities. We are using a timeout so the scene can load first
  setTimeout(2000, () => {
    mural.startLoading()
    palette.startLoading()
    palette.startSyncing()

    // mural.startSyncing()
    // palette.show()

    // mural.show()
    // button.show()
  })

  // When the user enters the scene, it starts syncing with other players
  addOneTimeTrigger(
    new Vector3(250.89, 0.45, 20),
    new Vector3(50, 8, 46),
    () => {
      mural.startSyncing()
      palette.show()
    }
  )

  // When the user is near the mural, then start showing it
  addOneTimeTrigger(
    new Vector3(250.89, 0.45, 14),
    new Vector3(45, 8, 20),
    () => {
      mural.show()
      button.show() // Show the button here, to make sure that everything is synced
    }
  )
}
