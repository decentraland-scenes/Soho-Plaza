// Hack for player position

import { addScreens } from './modules/video'
import { addZenquencer } from './zenquencer/zenquencerBuilder'
import { addPiano } from './piano/pianoBuilder'
import { createFountain } from './modules/fountain'
import { addBuildings } from './modules/buildings'
import { addLinks } from './modules/externalLinks'
import { followingEye } from './modules/krakenEye'
import { WearablesScanner } from './modules/scanner'
import { Category } from './modules/wearables'
import { placePlatforms } from './modules/platforms'
import { addVoxels } from './voxels/voxelBuilder'
import { addNFTs } from './galleries/galleryBuilder'
import Door from './modules/door'
import utils from '../node_modules/decentraland-ecs-utils/index'

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  log(`pos: `, Camera.instance.position)
  log(`rot: `, Camera.instance.rotation)
})

export let sceneMessageBus = new MessageBus()

/// MAIN BUILDINGS

addBuildings()

// VIDEO SCREENS

addScreens()

// DANCE FLOOR

// BOOM BOX

// SEQUENCER FOUNTAIN

addZenquencer(
  {
    position: new Vector3(285.4, 0.2, 287.2),
    rotation: Quaternion.Euler(0, 90, 0),
  },
  sceneMessageBus
)

// MURAL

// addMural()

/// VOXEL EDITOR

addVoxels()

// NFT GALLERY

addNFTs()

// PIANO

addPiano(
  new Transform({
    position: new Vector3(230, 0, 22),
  }),
  sceneMessageBus
)

// Voxel fountain

createFountain({ position: new Vector3(231.5, 0, 84.5) }, sceneMessageBus)

// Links to partners

addLinks()

// Kraken following eye

followingEye()

// Wearables scanner

let scanner = new WearablesScanner(
  {
    position: new Vector3(191, 0.3, 259),
    rotation: Quaternion.Euler(0, 180, 0),
  },
  Category.Eyewear,
  sceneMessageBus,
  () => {
    log('SUCCESS')

    //   sceneMessageBus.emit('openDoor', {})
    //   door.addComponentOrReplace(
    // 	new utils.Delay(5000, () => {
    // 	  sceneMessageBus.emit('closeDoor', {})
    // 	})
    //   )
  },
  () => {
    log('REJECTED')

    //sceneMessageBus.emit('closeDoor', {})
  },
  {
    position: new Vector3(191, 0.3, 256),
  }
)

let capsuleDoor = new Door(
  new GLTFShape('models/dj-console/door_capsule.glb'),
  {
    rotation: Quaternion.Euler(0, 0, 0),
    position: new Vector3(160, 0, 160),
  },
  'DoorOPEN_Action',
  'DoorCLOSE_Action',
  false,
  true,
  {
    position: new Vector3(195, 1, 262),
    scale: new Vector3(4, 6, 1),
  }
)

sceneMessageBus.on('scanning', () => {
  scanner.scan()
})

sceneMessageBus.on('scanapprove', () => {
  scanner.approve()
  capsuleDoor.toggle(true)
  capsuleDoor.addComponentOrReplace(
    new utils.Delay(5000, () => {
      capsuleDoor.toggle(false)
    })
  )
})

sceneMessageBus.on('scanreject', () => {
  scanner.reject()
  capsuleDoor.toggle(false)
})

// ELEVATOR AND OTHER PLATFORMS

placePlatforms()
