export class Button extends Entity {
  clickAnim: AnimationState
  constructor(
    model: string,
    transform: TransformConstructorArgs,
    animationName: string,
    parent?: Entity
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new GLTFShape(model))

    this.addComponentOrReplace(new Transform(transform))

    if (parent) {
      this.setParent(parent)
    }

    this.addComponent(new AudioSource(new AudioClip('sounds/click.mp3')))

    this.addComponent(new Animator())
    this.clickAnim = new AnimationState(animationName, { looping: false })
    this.getComponent(Animator).addClip(this.clickAnim)
  }

  public press(): void {
    this.clickAnim.stop() // bug workaround
    this.clickAnim.play()
    this.getComponent(AudioSource).playOnce()
  }
}

export class Switch extends Entity {
  onAnim: AnimationState
  offAnim: AnimationState
  isClicked: boolean = false
  constructor(
    model: string,
    transform: TransformConstructorArgs,
    onAnim: string,
    offAnim: string,
    parent?: Entity
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new GLTFShape(model))

    if (parent) {
      this.setParent(parent)
    }

    this.addComponent(new Transform(transform))

    this.addComponent(new AudioSource(new AudioClip('sounds/click.mp3')))

    this.addComponent(new Animator())
    this.onAnim = new AnimationState(onAnim, { looping: false })
    this.offAnim = new AnimationState(offAnim, { looping: false })
    this.getComponent(Animator).addClip(this.onAnim)
    this.getComponent(Animator).addClip(this.offAnim)
    this.onAnim.stop()
  }

  public toggle(value: boolean): void {
    if (this.isClicked === value) return
    this.isClicked = value

    this.onAnim.stop()
    this.offAnim.stop()
    const clip = value ? this.onAnim : this.offAnim
    clip.play()

    this.getComponent(AudioSource).playOnce()
  }
}
