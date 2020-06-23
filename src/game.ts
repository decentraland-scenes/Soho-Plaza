// Hack for player position

import { addScreens } from './modules/video'
import { addZenquencer } from './zenquencer/zenquencerBuilder'
import { addMural } from './mural/muralBuilder'
import { addVoxels } from './voxels/game'
import { addPiano } from './piano/pianoBuilder'
import { createFountain } from './modules/fountain'
import { addBuildings } from './modules/buildings'

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

addMural()

/// Voxels

addVoxels()

// Piano

addPiano(
  new Transform({
    position: new Vector3(230, 0, 22),
  })
)

createFountain({ position: new Vector3(231.5, 0, 84.5) })
