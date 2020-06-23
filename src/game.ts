// Hack for player position

import { addScreens } from './modules/video'
import { addZenquencer } from './zenquencer/zenquencerBuilder'
import { addVoxels } from './voxels/game'
import { addPiano } from './piano/pianoBuilder'
import { createFountain } from './modules/fountain'
import { addBuildings } from './modules/buildings'
import { addLinks } from './modules/externalLinks'
import { followingEye } from './modules/krakenEye'

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  log(`pos: `, Camera.instance.position)
  log(`rot: `, Camera.instance.rotation)
})

/// MAIN BUILDINGS

addBuildings()

// VIDEO SCREENS

addScreens()

//// Sequencer Fountain
addZenquencer()

//// Mural

//addMural()

/// Voxel 3d editor

addVoxels()

// Piano

addPiano(
  new Transform({
    position: new Vector3(230, 0, 22),
  })
)

// Voxel fountain

createFountain({ position: new Vector3(231.5, 0, 84.5) })

// Links to partners

addLinks()

// Kraken following eye

followingEye()
