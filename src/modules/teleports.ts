import {} from './ui' // prevents package not found bug

export enum Locations {
  PLANETVR = '-82,14',
  SOYOU = '25,-127',
  SUGAR = '-2,-35',
  LONDON = '-70,85',
  MUSEUM = '16,83',
  MINTBASE = '51,100',
  MAKERS = '-56,99',
  PIXELCHAIN = '51,96',
  SUPERRARE = '55,94',
  BOOMBOX = '',
  FEVER = '',
  KNOWNORIGIN = '',
  DODI = '',
}

export class Teleport extends Entity {
  model: GLTFShape
  location: Locations
  name: string
  constructor(
    model: GLTFShape,
    transform: TranformConstructorArgs,
    location: Locations,
    name: string
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(model)
    this.addComponent(new Transform(transform))

    this.name = name
    this.location = location

    let thisTeleport = this

    this.addComponent(
      new OnPointerDown(
        async function () {
          teleportTo(thisTeleport.location)
        },
        {
          button: ActionButton.PRIMARY,
          hoverText: this.name,
        }
      )
    )

    let Particles = new Entity()
    Particles.addComponent(new GLTFShape('models/particles.glb'))
    Particles.setParent(this)

    let teleportFloor = new Entity()
    teleportFloor.addComponent(new GLTFShape('models/teleports/teleport.glb'))
    teleportFloor.addComponent(new Transform({}))
    teleportFloor.setParent(this)
  }
}

export function placeTeleports() {
  // near museum A
  let teleportPos1 = new Transform({
    position: new Vector3(78.55, 0.3, 243),
    rotation: Quaternion.Euler(0, 0, 0),
  })

  // museum A & museum B
  let teleportPos2 = new Transform({
    position: new Vector3(71.3, 0.3, 190),
    rotation: Quaternion.Euler(0, 225, 0),
  })

  // fountain South
  let teleportPos3 = new Transform({
    position: new Vector3(229.4, 0.3, 54.41),
    rotation: Quaternion.Euler(0, 0, 0),
  })

  // fountain East
  let teleportPos4 = new Transform({
    position: new Vector3(266.4, 0.3, 83.94),
    rotation: Quaternion.Euler(0, 270, 0),
  })

  // voxel editor
  let teleportPos5 = new Transform({
    position: new Vector3(267.99, 0.8, 182.64),
    rotation: Quaternion.Euler(0, 90, 0),
  })

  // kraken East
  let teleportPos6 = new Transform({
    position: new Vector3(209, 1.8, 212.8),
    rotation: Quaternion.Euler(0, 270, 0),
  })

  // kraken West
  let teleportPos7 = new Transform({
    position: new Vector3(163.83, 0.3, 236.63),
    rotation: Quaternion.Euler(0, 90, 0),
  })

  // minicapsule 1
  let teleportPos8 = new Transform({
    position: new Vector3(144.88, 0.45, 293.19),
    rotation: Quaternion.Euler(0, 135, 0),
  })

  // minicapsule 2
  let teleportPos9 = new Transform({
    position: new Vector3(169.92, 0.3, 307),
    rotation: Quaternion.Euler(0, 135, 0),
  })

  // kraken South
  let teleportPos10 = new Transform({
    position: new Vector3(175.89, 2, 175.11),
    rotation: Quaternion.Euler(0, 45, 0),
  })

  //   let teleportPos11 = new Transform({
  //     position: new Vector3(175.89, 2, 175.11),
  //     rotation: Quaternion.Euler(0, 45, 0),
  //   })

  let teleports = [
    {
      name: 'Museum District',
      model: new GLTFShape('models/teleports/museum_district.glb'),
      location: Locations.MUSEUM,
      transform: teleportPos1,
    },
    {
      name: 'Mintbase',
      model: new GLTFShape('models/teleports/Mintbase.glb'),
      location: Locations.MINTBASE,
      transform: teleportPos2,
    },
    {
      name: 'MakersPlace',
      model: new GLTFShape('models/teleports/Makersplace.glb'),
      location: Locations.MAKERS,
      transform: teleportPos3,
    },
    {
      name: 'PixelChain',
      model: new GLTFShape('models/teleports/PixelChain.glb'),
      location: Locations.PIXELCHAIN,
      transform: teleportPos4,
    },
    {
      name: 'MANA Fever',
      model: new GLTFShape('models/teleports/MANAFEVER.glb'),
      location: Locations.FEVER,
      transform: teleportPos5,
    },
    {
      name: 'Planet VR',
      model: new GLTFShape('models/teleports/PlanetVR.glb'),
      location: Locations.PLANETVR,
      transform: teleportPos6,
    },
    {
      name: 'SuperRare',
      model: new GLTFShape('models/teleports/SuperRare.glb'),
      location: Locations.SUPERRARE,
      transform: teleportPos7,
    },
    {
      name: 'London Underground',
      model: new GLTFShape('models/teleports/LondonUnderground.glb'),
      location: Locations.LONDON,
      transform: teleportPos8,
    },
    {
      name: 'Sugar Club',
      model: new GLTFShape('models/teleports/SugarClub.glb'),
      location: Locations.SUGAR,
      transform: teleportPos9,
    },
    {
      name: 'Boombox Club',
      model: new GLTFShape('models/teleports/Boombox-club.glb'),
      location: Locations.BOOMBOX,
      transform: teleportPos10,
    },

    // SO YOU  teleportPos11
  ]

  for (let i of teleports) {
    let t = new Teleport(i.model, i.transform, i.location, i.name)
  }
}
