// Hack for player position

import { addScreens } from './modules/video'
import { addZenquencer } from './zenquencer/zenquencerBuilder'
import { addPiano } from './piano/pianoBuilder'
import { createFountain } from './modules/fountain'
import { addBuildings } from './modules/buildings'
import { addLinks } from './modules/externalLinks'
import { followingEye } from './modules/krakenEye'
import { placePlatforms } from './modules/platforms'
import { addVoxels } from './voxels/voxelBuilder'
import { addNFTs } from './galleries/galleryBuilder'
import utils from '../node_modules/decentraland-ecs-utils/index'
import { addDanceFloor } from './modules/danceFloor'
import { placeTeleports } from './modules/teleports'

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

addDanceFloor()

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

// ELEVATOR AND OTHER PLATFORMS

placePlatforms()

// Teleports

placeTeleports()
