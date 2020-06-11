// Hack for player position

import { addScreens } from './modules/video'

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  log(`pos: `, Camera.instance.position)
  log(`rot: `, Camera.instance.rotation)
})

// VIDEO SCREENS

addScreens()

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

//add skate_park
let skate_park = new Entity()
skate_park.addComponent(new GLTFShape("models/skate_park.glb"))
skate_park.addComponent(new Transform({
	position: new Vector3(160, 0, 160),
	rotation: Quaternion.Euler(0, 0, 0)
}
))
engine.addEntity(skate_park)
