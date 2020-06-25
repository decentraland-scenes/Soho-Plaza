export default class Door extends Entity {
  open: boolean = false
  openAnim: AnimationState
  closeAnim: AnimationState
  //   openSound = new AudioClip('sounds/open.mp3')
  //   closeSound = new AudioClip('sounds/close.mp3')

  constructor(
    model: GLTFShape,
    pos: TranformConstructorArgs,
    openAnim: string,
    closeAnim: string,
    open?: boolean
  ) {
    super()
    this.addComponent(new Transform(pos))
    this.addComponent(model)
    engine.addEntity(this)

    const animator = new Animator()
    this.openAnim = new AnimationState(openAnim, { looping: false })
    this.closeAnim = new AnimationState(closeAnim, { looping: false })
    animator.addClip(this.closeAnim)
    animator.addClip(this.openAnim)
    this.addComponent(animator)
    this.openAnim.stop()

    if (open) {
      this.open = open
      this.openAnim.play()
    }
  }

  toggle(value: boolean, playSound = true) {
    if (this.open === value) return
    this.open = value

    // if (playSound) {
    //   const source = new AudioSource(value ? this.openClip : this.closeClip)
    //   this.addComponentOrReplace(source)
    //   source.playing = true
    // }

    const animator = this.getComponent(Animator)

    this.openAnim.stop()
    this.closeAnim.stop()
    const clip = value ? this.closeAnim : this.openAnim
    clip.play()
  }
}
