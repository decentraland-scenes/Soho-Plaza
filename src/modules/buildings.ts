export function addBuildings() {
  // SOHO BASE STREET

  //add street
  let street = new Entity()
  street.addComponent(new GLTFShape('models/street.glb'))
  street.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(street)

  //add teleports
  let teleports = new Entity()
  teleports.addComponent(new GLTFShape('models/teleports.glb'))
  teleports.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(teleports)

  //add globe
  let globe = new Entity()
  globe.addComponent(new GLTFShape('models/globe.glb'))
  globe.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(globe)

  // MAIN MUSEUM

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

  // PS1 MUSEUM

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

  // CAPSULE NIGHTCLUB

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

  //add water_fountain
  let water_fountain = new Entity()
  water_fountain.addComponent(new GLTFShape('models/water_fountain.glb'))
  water_fountain.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(water_fountain)

  // ANIMALS PARK

  //add animals_park
  let animals_park = new Entity()
  animals_park.addComponent(new GLTFShape('models/animals_park.glb'))
  animals_park.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(animals_park)

  // DINO CINEMA

  //add cinema_park
  let cinema_park = new Entity()
  cinema_park.addComponent(new GLTFShape('models/cinema_park.glb'))
  cinema_park.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(cinema_park)

  // DRAGON CAVE

  //add dragon_park
  let dragon_park = new Entity()
  dragon_park.addComponent(new GLTFShape('models/dragon_park.glb'))
  dragon_park.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(dragon_park)

  //KONG PARK

  //add kong_park
  let kong_park = new Entity()
  kong_park.addComponent(new GLTFShape('models/kong_park.glb'))
  kong_park.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(kong_park)

  // SPACESHIP

  //add spaceship_park
  let spaceship_park = new Entity()
  spaceship_park.addComponent(new GLTFShape('models/spaceship_park.glb'))
  spaceship_park.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(spaceship_park)
}
