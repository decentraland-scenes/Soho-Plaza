import utils from '../../node_modules/decentraland-ecs-utils/index'

export class VideoScreen extends Entity {
  texture: VideoTexture
  constructor(
    screenPos: TranformConstructorArgs,
    triggerPos: TranformConstructorArgs,
    triggerScale: Vector3,
    streamURL: string
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new PlaneShape())
    this.addComponent(new Transform(screenPos))

    this.addComponent(new Animator())

    this.texture = new VideoTexture(new VideoClip(streamURL))
    this.texture.playing = false
    const mat = new Material()
    mat.albedoTexture = this.texture
    mat.specularIntensity = 0
    mat.roughness = 1
    mat.metallic = 0

    this.addComponent(mat)

    const triggerEntity = new Entity()
    triggerEntity.addComponent(new Transform(triggerPos))

    let triggerBox = new utils.TriggerBoxShape(triggerScale, Vector3.Zero())

    triggerEntity.addComponent(
      new utils.TriggerComponent(
        triggerBox, //shape
        0, //layer
        0, //triggeredByLayer
        null, //onTriggerEnter
        null, //onTriggerExit
        () => {
          this.activate()
        },
        () => {
          this.deactivate()
        }, //onCameraExit
        false // debug mode
      )
    )
    engine.addEntity(triggerEntity)
  }

  public activate(): void {
    this.texture.playing = true
  }
  public deactivate(): void {
    this.texture.playing = false
  }
}

export function addScreens() {
  const screen1 = new VideoScreen(
    {
      position: new Vector3(28.8, 10.4, 62.5),
      rotation: Quaternion.Euler(0, 0, 0), //new Quaternion(-0.7259005, 0.2195348, -0.5940643, 0.2682545),
      scale: new Vector3(10 * 2, 5.6 * 2, 10 * 2),
    },
    { position: new Vector3(28.8, 5, 75) },
    new Vector3(75, 14, 80),
    'https://theuniverse.club/live/genesisplaza/index.m3u8'
  )

  const screen2 = new VideoScreen(
    {
      position: new Vector3(22.45, 7.6, 296.2),
      rotation: Quaternion.Euler(0, 130, 0), //new Quaternion(-0.7259005, 0.2195348, -0.5940643, 0.2682545),
      scale: new Vector3(10 * 1.6, 5.6 * 1.6, 10 * 1.6),
    },
    { position: new Vector3(40, 5, 282) },
    new Vector3(75, 14, 80),
    'https://theuniverse.club/live/genesisplaza/index.m3u8'
  )
}
