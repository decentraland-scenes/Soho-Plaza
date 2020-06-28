import { checkWearableCategory, Category } from './wearables'
import utils from '../../node_modules/decentraland-ecs-utils/index'

export class WearablesScanner extends Entity {
  filter: Category
  scanAnim: AnimationState
  allowAnim: AnimationState
  rejectAnim: AnimationState
  scanAudio: AudioClip = new AudioClip('sounds/LaserHum.mp3')
  allowAudio: AudioClip = new AudioClip('sounds/accept.mp3')
  rejectAudio: AudioClip = new AudioClip('sounds/access_denied.mp3')
  constructor(
    position: TranformConstructorArgs,
    filter: Category,
    messageBus: MessageBus,
    successAction: () => void,
    rejectAction?: () => void,
    triggerPos?: TranformConstructorArgs,
    triggerScale?: Vector3
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new GLTFShape('models/Wearable-Reader.glb'))
    this.addComponent(new Transform(position))

    this.addComponent(new Animator())
    this.scanAnim = new AnimationState('Laser_Action', { looping: false })
    this.allowAnim = new AnimationState('Allow_Action', { looping: false })
    this.rejectAnim = new AnimationState('NotAllow_Action', { looping: false })

    this.getComponent(Animator).addClip(this.scanAnim)
    this.getComponent(Animator).addClip(this.allowAnim)
    this.getComponent(Animator).addClip(this.rejectAnim)

    if (!triggerScale) {
      triggerScale = new Vector3(2.5, 4, 2.5)
    }

    const scannerTriggerEntity = new Entity()

    if (!triggerPos) {
      triggerPos = { position: new Vector3(0, 1.5, 2) }
      scannerTriggerEntity.setParent(this)
    }

    scannerTriggerEntity.addComponent(new Transform(triggerPos))

    let triggerBox = new utils.TriggerBoxShape(triggerScale, Vector3.Zero())

    scannerTriggerEntity.addComponent(
      new utils.TriggerComponent(
        triggerBox, //shape
        0, //layer
        0, //triggeredByLayer
        null, //onTriggerEnter
        null, //onTriggerExit
        () => {
          log('triggered scanner')
          messageBus.emit('scanning', {})

          scannerTriggerEntity.addComponentOrReplace(
            new utils.Delay(4000, async () => {
              let result: boolean = await checkWearableCategory(filter)
              if (result) {
                messageBus.emit('scanapprove', {})
                successAction()
              } else {
                messageBus.emit('scanreject', {})
                rejectAction ? rejectAction() : null
              }
            })
          )
        },
        null, //onCameraExit
        false
      )
    )
    engine.addEntity(scannerTriggerEntity)
  }

  public scan(): void {
    this.allowAnim.stop()
    this.rejectAnim.stop()
    this.scanAnim.stop()
    this.scanAnim.play()
    let thisScanner = this
    this.addComponentOrReplace(
      new AudioSource(thisScanner.scanAudio)
    ).playOnce()
  }

  public approve(): void {
    this.scanAnim.stop()
    this.allowAnim.stop()
    this.allowAnim.play()
    let thisScanner = this
    this.addComponentOrReplace(
      new AudioSource(thisScanner.allowAudio)
    ).playOnce()
  }

  public reject(): void {
    this.scanAnim.stop()
    this.rejectAnim.stop()
    this.rejectAnim.play()
    let thisScanner = this
    this.addComponentOrReplace(
      new AudioSource(thisScanner.rejectAudio)
    ).playOnce()
  }
}
