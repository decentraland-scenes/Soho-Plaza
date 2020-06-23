import utils from '../../node_modules/decentraland-ecs-utils/index'
import { sceneMessageBus } from './serverHandler'

export function createFountain(position: TranformConstructorArgs) {
  let rings: Ring[] = []

  let base = new Entity()
  //base.addComponent(new GLTFShape('models/fountain/Base.glb'))
  base.addComponent(new Transform(position))
  engine.addEntity(base)

  let ring1 = new Ring(
    {
      position: new Vector3(0, -0.75, 0),
    },
    'models/fountain/FirstRing.glb',
    '1stRing_Action_01',
    '1stRing_Action_02',
    '1stRing_Action_03',
    base
  )

  rings.push(ring1)

  let ring2 = new Ring(
    {
      position: new Vector3(0, -0.8, 0),
    },
    'models/fountain/SecondRing.glb',
    '2ndRing_Action_01',
    '2ndRing_Action_02',
    '2ndRing_Action_03',
    base
  )

  rings.push(ring2)

  let ring3 = new Ring(
    {
      position: new Vector3(0, -1, 0),
    },
    'models/fountain/ThirdRing.glb',
    '3rdRing_Action_01',
    '3rdRing_Action_02',
    '3rdRing_Action_03',
    base
  )
  rings.push(ring3)

  let ring4 = new Ring(
    {
      position: new Vector3(0, -1, 0),
    },
    'models/fountain/FourthRing.glb',
    '4thRing_Action_01',
    '4thRing_Action_02',
    '4thRing_Action_03',
    base
  )
  rings.push(ring4)

  let cyanConsole = new Console(
    { position: new Vector3(-23, -0.1, 0) },
    base,
    'models/buttons/Cyan/Base/BaseCyan.glb',
    3,
    'models/buttons/Cyan/Buttons/ButtonA_Cyan.glb',
    'ButtonA_Action',
    'models/buttons/Cyan/Buttons/ButtonB_Cyan.glb',
    'ButtonB_Action',
    'models/buttons/Cyan/Buttons/ButtonC_Cyan.glb',
    'ButtonC_Action'
  )

  let redConsole = new Console(
    {
      position: new Vector3(0, -0.1, 23),
      rotation: Quaternion.Euler(0, 90, 0),
    },
    base,
    'models/buttons/Red/Base/BaseRed.glb',
    2,
    'models/buttons/Red/Buttons/ButtonA_Red.glb',
    'ButtonA_Action',
    'models/buttons/Red/Buttons/ButtonB_Red.glb',
    'ButtonB_Action',
    'models/buttons/Red/Buttons/ButtonC_Red.glb',
    'ButtonC_Action'
  )

  let violetConsole = new Console(
    {
      position: new Vector3(23, -0.1, 0),
      rotation: Quaternion.Euler(0, 180, 0),
    },
    base,
    'models/buttons/Violet/Base/BaseViolet.glb',
    1,
    'models/buttons/Violet/Buttons/ButtonA_Violet.glb',
    'ButtonA_Action',
    'models/buttons/Violet/Buttons/ButtonB_Violet.glb',
    'ButtonB_Action',
    'models/buttons/Violet/Buttons/ButtonC_Violet.glb',
    'ButtonC_Action'
  )

  let yellowConsole = new Console(
    {
      position: new Vector3(0, -0.1, -23),
      rotation: Quaternion.Euler(0, 270, 0),
    },
    base,
    'models/buttons/Yellow/Base/BaseYellow.glb',
    0,
    'models/buttons/Yellow/Buttons/ButtonA_Yellow.glb',
    'ButtonA_Action',
    'models/buttons/Yellow/Buttons/ButtonB_Yellow.glb',
    'ButtonB_Action',
    'models/buttons/Yellow/Buttons/ButtonC_Yellow.glb',
    'ButtonC_Action'
  )

  sceneMessageBus.on('fountainAnim', (e) => {
    fountainPlayer.playingMode = 0
    base.addComponentOrReplace(
      new utils.Delay(20000, () => {
        fountainPlayer.playingMode = 1
      })
    )
    switch (e.anim) {
      case 1:
        rings[e.ring].play1()
        break
      case 2:
        rings[e.ring].play2()
        break
      case 3:
        rings[e.ring].play3()
        break
    }
  })

  /// RANDOMIZER

  class RandomFountain implements ISystem {
    ringOneActive: boolean = false
    ringTwoActive: boolean = false
    ringThreeActive: boolean = false
    ringFourActive: boolean = false
    animDuration: number
    timer1: number
    timer2: number
    timer3: number
    timer4: number
    mainTimer: number
    playingMode: number = 0

    constructor(animDuration: number) {
      this.animDuration = animDuration

      this.timer1 = 0
      this.timer2 = 0
      this.timer3 = 0
      this.timer4 = 0
      this.mainTimer = 0
      this.playingMode = 1
    }
    update(dt: number) {
      if (this.playingMode == 0) {
        // in free control mode
        return
      }

      if (this.playingMode == 1) {
        // random mode

        if (this.ringOneActive) {
          this.timer1 -= dt
          if (this.timer1 < 0) {
            this.ringOneActive = false
          }
        }
        if (this.ringTwoActive) {
          this.timer2 -= dt
          if (this.timer2 < 0) {
            this.ringTwoActive = false
          }
        }
        if (this.ringThreeActive) {
          this.timer3 -= dt
          if (this.timer3 < 0) {
            this.ringThreeActive = false
          }
        }

        if (this.ringFourActive) {
          this.timer4 -= dt
          if (this.timer4 < 0) {
            this.ringFourActive = false
          }
        }

        this.mainTimer += dt

        if (this.mainTimer > this.animDuration / 2) {
          let randomIndex = Math.floor(Math.random() * 1500)
          //log(randomIndex)
          switch (randomIndex) {
            case 1:
              if (this.ringOneActive) break
              rings[0].play1()
              this.ringOneActive = true
              this.timer1 = this.animDuration
              this.mainTimer = 0
              break
            case 2:
              if (this.ringOneActive) break
              rings[0].play2()
              this.ringOneActive = true
              this.timer1 = this.animDuration
              this.mainTimer = 0
              break
            case 3:
              if (this.ringOneActive) break
              rings[0].play3()
              this.ringOneActive = true
              this.timer1 = this.animDuration
              this.mainTimer = 0
              break

            case 4:
              if (this.ringTwoActive) break
              rings[1].play1()
              this.ringTwoActive = true
              this.timer2 = this.animDuration
              this.mainTimer = 0
              break
            case 5:
              if (this.ringTwoActive) break
              rings[1].play2()
              this.ringTwoActive = true
              this.timer2 = this.animDuration
              this.mainTimer = 0
              break
            case 6:
              if (this.ringTwoActive) break
              rings[1].play3()
              this.ringTwoActive = true
              this.timer2 = this.animDuration
              this.mainTimer = 0
              break

            case 5:
              if (this.ringThreeActive) break
              rings[2].play1()
              this.ringThreeActive = true
              this.timer3 = this.animDuration
              this.mainTimer = 0
              break
            case 6:
              if (this.ringThreeActive) break
              rings[2].play2()
              this.ringThreeActive = true
              this.timer3 = this.animDuration
              this.mainTimer = 0
              break
            case 7:
              if (this.ringThreeActive) break
              rings[2].play3()
              this.ringThreeActive = true
              this.timer3 = this.animDuration
              this.mainTimer = 0
              break

            case 8:
              if (this.ringFourActive) break
              rings[3].play1()
              this.ringFourActive = true
              this.timer4 = this.animDuration
              this.mainTimer = 0
              break
            case 9:
              if (this.ringFourActive) break
              rings[3].play2()
              this.ringFourActive = true
              this.timer4 = this.animDuration
              this.mainTimer = 0
              break
            case 10:
              if (this.ringFourActive) break
              rings[3].play3()
              this.ringFourActive = true
              this.timer4 = this.animDuration
              this.mainTimer = 0
              break
          }
        }
      }
    }
  }

  let fountainPlayer = new RandomFountain(10)

  engine.addSystem(fountainPlayer)
}

export class Ring extends Entity {
  animation1: AnimationState
  animation2: AnimationState
  animation3: AnimationState

  constructor(
    transform: TranformConstructorArgs,
    model: string,
    animation1: string,
    animation2: string,
    animation3: string,
    parent: Entity
  ) {
    super()
    engine.addEntity(this)
    this.setParent(parent)

    this.addComponent(new GLTFShape(model))
    this.addComponent(new Transform(transform))

    this.addComponent(new Animator())

    this.animation1 = new AnimationState(animation1, { looping: false })
    this.getComponent(Animator).addClip(this.animation1)
    this.animation2 = new AnimationState(animation2, { looping: false })
    this.getComponent(Animator).addClip(this.animation2)
    this.animation3 = new AnimationState(animation3, { looping: false })
    this.getComponent(Animator).addClip(this.animation3)
  }
  public play1(): void {
    log('playing1')
    this.animation1.stop()
    this.animation2.stop()
    this.animation3.stop()

    this.animation1.play()
  }
  public play2(): void {
    log('playing2')
    this.animation1.stop()
    this.animation2.stop()
    this.animation3.stop()

    this.animation2.play()
  }
  public play3(): void {
    log('playing3')
    this.animation1.stop()
    this.animation2.stop()
    this.animation3.stop()

    this.animation3.play()
  }
}

export class ConsoleButton extends Entity {
  clickAnim: AnimationState
  constructor(model: string, parent: Entity, animationName: string) {
    super()
    engine.addEntity(this)

    this.addComponent(new GLTFShape(model))

    this.setParent(parent)

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

export class Console extends Entity {
  clickAnim: AnimationState
  constructor(
    transform: TranformConstructorArgs,
    parent: Entity,
    model: string,
    targetRing: number,
    button1Model: string,
    button1Anim: string,
    button2Model: string,
    button2Anim: string,
    button3Model: string,
    button3Anim: string
  ) {
    super()
    engine.addEntity(this)
    this.setParent(parent)

    this.addComponent(new GLTFShape(model))
    this.addComponent(new Transform(transform))

    let button1 = new ConsoleButton(button1Model, this, button1Anim)
    let button2 = new ConsoleButton(button2Model, this, button2Anim)
    let button3 = new ConsoleButton(button3Model, this, button3Anim)

    button1.addComponent(
      new OnPointerDown(() => {
        button1.press()
        sceneMessageBus.emit('fountainAnim', { ring: targetRing, anim: 1 })
      })
    )

    button2.addComponent(
      new OnPointerDown(() => {
        button2.press()
        sceneMessageBus.emit('fountainAnim', { ring: targetRing, anim: 2 })
      })
    )

    button3.addComponent(
      new OnPointerDown(() => {
        button3.press()
        sceneMessageBus.emit('fountainAnim', { ring: targetRing, anim: 3 })
      })
    )
  }
}
