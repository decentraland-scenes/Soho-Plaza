import * as utils from '@dcl/ecs-scene-utils'

export class VideoScreen extends Entity {
  texture: VideoTexture
  constructor(
    screenPos: TransformConstructorArgs,
    triggerPos: TransformConstructorArgs,
    triggerScale: Vector3,
    streamURL: string
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new PlaneShape())
    this.addComponent(new Transform(screenPos))

    this.texture = new VideoTexture(new VideoClip(streamURL))
    this.texture.playing = false
    this.texture.loop = true
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
      new utils.TriggerComponent(triggerBox, {
        onCameraEnter: () => {
          this.activate()
        },
        onCameraExit: () => {
          this.deactivate()
        },
      })
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
      position: new Vector3(28.8, 10.4, 58.15),
      rotation: Quaternion.Euler(0, 0, 0), //new Quaternion(-0.7259005, 0.2195348, -0.5940643, 0.2682545),
      scale: new Vector3(10 * 2, 5.6 * 2, 10 * 2),
    },
    { position: new Vector3(28.8, 5, 75) },
    new Vector3(75, 14, 80),
    'https://player.vimeo.com/external/575854261.m3u8?s=d09797037b7f4f1013d337c04836d1e998ad9c80'
  )

  const screen2 = new VideoScreen(
    {
      position: new Vector3(22.45, 7.6, 296.2),
      rotation: Quaternion.Euler(0, 130, 0), //new Quaternion(-0.7259005, 0.2195348, -0.5940643, 0.2682545),
      scale: new Vector3(10 * 1.6, 5.6 * 1.6, 10 * 1.6),
    },
    { position: new Vector3(40, 5, 282) },
    new Vector3(75, 14, 80),
    'https://player.vimeo.com/external/575854261.m3u8?s=d09797037b7f4f1013d337c04836d1e998ad9c80'
  )

  const screen3 = new VideoScreen(
    {
      position: new Vector3(165.17, 6.4, 83),
      rotation: Quaternion.Euler(0, -90, 0), //new Quaternion(-0.7259005, 0.2195348, -0.5940643, 0.2682545),
      scale: new Vector3(10 * 0.8, 5.6 * 0.8, 10 * 0.8),
    },
    { position: new Vector3(174, 5, 82) },
    new Vector3(50, 14, 80),
    'https://player.vimeo.com/external/575854261.m3u8?s=d09797037b7f4f1013d337c04836d1e998ad9c80'
  )
}
