// Hack for player position

import { addScreens } from './modules/video'
import { addZenquencer } from './zenquencer/zenquencerBuilder'
import { addMural } from './mural/muralBuilder'
import { addVoxels } from './voxels/game'
import { addPiano } from './piano/pianoBuilder'
import { createFountain } from './modules/fountain'

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  log(`pos: `, Camera.instance.position)
  log(`rot: `, Camera.instance.rotation)
})

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

createFountain({ position: new Vector3(231, 0, 85) })

// SOHO BASE BUILDING

//add soho_base
let soho_base = new Entity()
soho_base.addComponent(new GLTFShape('models/soho_base.glb'))
soho_base.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(soho_base)

//add museum
let museum = new Entity()
museum.addComponent(new GLTFShape('models/museum.glb'))
museum.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(museum)

//add museum_b
let museum_b = new Entity()
museum_b.addComponent(new GLTFShape('models/museum_b.glb'))
museum_b.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(museum_b)

//add color_drops
let color_drops = new Entity()
color_drops.addComponent(new GLTFShape('models/color_drops.glb'))
color_drops.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(color_drops)

//add dots
let dots = new Entity()
dots.addComponent(new GLTFShape('models/dots.glb'))
dots.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(dots)

//add capsule
let capsule = new Entity()
capsule.addComponent(new GLTFShape('models/capsule.glb'))
capsule.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(capsule)

//add lights_capsule
let lights_capsule = new Entity()
lights_capsule.addComponent(new GLTFShape('models/lights_capsule.glb'))
lights_capsule.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(lights_capsule)

//SKATEPARK AREA

//add skate_park
let skate_park = new Entity()
skate_park.addComponent(new GLTFShape('models/skate_park.glb'))
skate_park.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(skate_park)

// VOXEL AREA

//add kraken
let kraken = new Entity()
kraken.addComponent(new GLTFShape('models/kraken.glb'))
kraken.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(kraken)

//add enter_coin
let enter_coin = new Entity()
enter_coin.addComponent(new GLTFShape('models/enter_coin.glb'))
enter_coin.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(enter_coin)

//add chopper
let chopper = new Entity()
chopper.addComponent(new GLTFShape('models/chopper.glb'))
chopper.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(chopper)

// ADD NFT AREA

//add nft_area
let nft_area = new Entity()
nft_area.addComponent(new GLTFShape('models/nft_area.glb'))
nft_area.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(nft_area)

//add ethremon_tenteink
let ethremon_tenteink = new Entity()
ethremon_tenteink.addComponent(new GLTFShape('models/ethremon_tenteink.glb'))
ethremon_tenteink.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(ethremon_tenteink)

//add ethremon_matara
let ethremon_matara = new Entity()
ethremon_matara.addComponent(new GLTFShape('models/ethremon_matara.glb'))
ethremon_matara.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(ethremon_matara)

//add kotaro
let kotaro = new Entity()
kotaro.addComponent(new GLTFShape('models/kotaro.glb'))
kotaro.addComponent(
  new Transform({
    position: new Vector3(160, 0, 160),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(kotaro)

// //add water_fountain
// let water_fountain = new Entity()
// water_fountain.addComponent(new GLTFShape("models/water_fountain.glb"))
// water_fountain.addComponent(new Transform({
// 	position: new Vector3(160, 0, 160),
// 	rotation: Quaternion.Euler(0, 0, 0)
// }
// ))
// engine.addEntity(water_fountain)

// VOXEL FOUNTAIN

// //add FirstRing
// let FirstRing = new Entity()
// FirstRing.addComponent(new GLTFShape("models/FirstRing.glb"))
// FirstRing.addComponent(new Transform({
// 	position: new Vector3(160, 0, 160),
// 	rotation: Quaternion.Euler(0, 0, 0)
// }
// ))
// engine.addEntity(FirstRing)

// //add SecondRing
// let SecondRing = new Entity()
// SecondRing.addComponent(new GLTFShape("models/SecondRing.glb"))
// SecondRing.addComponent(new Transform({
// 	position: new Vector3(160, 0, 160),
// 	rotation: Quaternion.Euler(0, 0, 0)
// }
// ))
// engine.addEntity(SecondRing)

// //add ThirdRing
// let ThirdRing = new Entity()
// ThirdRing.addComponent(new GLTFShape("models/ThirdRing.glb"))
// ThirdRing.addComponent(new Transform({
// 	position: new Vector3(160, 0, 160),
// 	rotation: Quaternion.Euler(0, 0, 0)
// }
// ))
// engine.addEntity(ThirdRing)

// //add FourthRing
// let FourthRing = new Entity()
// FourthRing.addComponent(new GLTFShape("models/FourthRing.glb"))
// FourthRing.addComponent(new Transform({
// 	position: new Vector3(160, 0, 160),
// 	rotation: Quaternion.Euler(0, 0, 0)
// }
// ))
// engine.addEntity(FourthRing)
