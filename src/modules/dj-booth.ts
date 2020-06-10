import { sceneMessageBus } from './serverHandler'
import utils from '../../node_modules/decentraland-ecs-utils/index'

export enum Radios {
  RAVE = 'https://icecast.ravepartyradio.org/ravepartyradio-192.mp3',
  INTERVIEW = 'https://dclcoreradio.com/dclradio.ogg',
  DELTA = 'https://cdn.instream.audio/:9069/stream?_=171cd6c2b6e',
  SIGNS = 'https://edge.singsingmusic.net/MC2.mp3',
}

let isInRadioRange: boolean = false
let currentRadio: Radios | null = null

const musicStreamEnt = new Entity()
engine.addEntity(musicStreamEnt)

let musicStream: AudioStream | null = null

let baseConsole = new Entity()
baseConsole.addComponent(new GLTFShape('models/dj-console/dj-capsule.glb'))
baseConsole.addComponent(
  new Transform({
    position: new Vector3(194.5, 0, 299),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(baseConsole)

export class ConsoleButton extends Entity {
  clickAnim: AnimationState
  constructor(model: GLTFShape, parent: Entity, animationName: string) {
    super()
    engine.addEntity(this)

    this.addComponent(model)
    this.setParent(parent)

    this.addComponent(new AudioSource(new AudioClip('sounds/click.mp3')))

    this.addComponent(new Animator())
    this.clickAnim = new AnimationState(animationName, { looping: false })
    this.getComponent(Animator).addClip(this.clickAnim)
  }

  /**
   * A button can be pressed.  At the moment this just plays a sound effect
   * but maybe an animation will be added in the future as well.
   */
  public press(): void {
    this.clickAnim.stop() // bug workaround
    this.clickAnim.play()
    this.getComponent(AudioSource).playOnce()
  }
}

let blueButton = new ConsoleButton(
  new GLTFShape('models/dj-console/blue_button.glb'),
  baseConsole,
  'BlueButton_Action'
)

blueButton.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('setRadio', {
        station: Radios.RAVE,
      })
      blueButton.press()
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'Rave',
    }
  )
)

let greenButton = new ConsoleButton(
  new GLTFShape('models/dj-console/green_button.glb'),
  baseConsole,
  'GreenButton_Action'
)

greenButton.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('setRadio', {
        station: Radios.INTERVIEW,
      })
      greenButton.press()
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'DCL Interviews',
    }
  )
)

let violetButton = new ConsoleButton(
  new GLTFShape('models/dj-console/violet_button.glb'),
  baseConsole,
  'VioletButton_Action'
)

violetButton.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('setRadio', {
        station: Radios.DELTA,
      })
      violetButton.press()
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'Delta',
    }
  )
)

let redButton = new ConsoleButton(
  new GLTFShape('models/dj-console/red_button.glb'),
  baseConsole,
  'RedButton_Action'
)

redButton.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('setRadio', {
        station: Radios.SIGNS,
      })
      redButton.press()
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'Signs',
    }
  )
)

let yellowButton = new ConsoleButton(
  new GLTFShape('models/dj-console/yellow_button.glb'),
  baseConsole,
  'YellowButton_Action'
)

yellowButton.addComponent(
  new OnPointerDown(
    () => {
      sceneMessageBus.emit('setRadio', {
        station: Radios.SIGNS,
      })
      yellowButton.press()
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'Signs',
    }
  )
)

sceneMessageBus.on('setRadio', (e) => {
  //  if()  if close
  if (musicStream) {
    musicStream.playing = false
    musicStream = null
  }
  currentRadio = e.station
  radioOn(e.station)
})

function radioOn(station) {
  //   LightsA.play()
  //   LightsB.play()
  //   LightsC.play()
  if (isInRadioRange) {
    musicStreamEnt.addComponent(
      new utils.Delay(100, () => {
        musicStream = new AudioStream(station)
        musicStreamEnt.addComponentOrReplace(musicStream)
      })
    )
  }
}

function radioOff() {
  //   LightsA.stop()
  //   LightsB.stop()
  //   LightsC.stop()
  if (musicStream) {
    musicStream.playing = false
  }
}

///// LIGTHS

// let LightsA = new AnimationState('Lights_Anim')
// let LightsB = new AnimationState('LightsB_Artichoke')
// let LightsC = new AnimationState('LightsC_Artichoke')

// let artichokeLightsA = new Entity()
// artichokeLightsA.addComponent(new GLTFShape('models/LightsA_Artichoke.glb'))
// artichokeLightsA.addComponent(
//   new Transform({
//     rotation: Quaternion.Euler(0, 180, 0),
//   })
// )
// artichokeLightsA.addComponent(new Animator()).addClip(LightsA)
// engine.addEntity(artichokeLightsA)

// let artichokeLightsB = new Entity()
// artichokeLightsB.addComponent(new GLTFShape('models/LightsB_Artichoke.glb'))
// artichokeLightsB.addComponent(
//   new Transform({
//     rotation: Quaternion.Euler(0, 180, 0),
//   })
// )
// artichokeLightsB.addComponent(new Animator()).addClip(LightsB)
// engine.addEntity(artichokeLightsB)

// let artichokeLightsC = new Entity()
// artichokeLightsC.addComponent(new GLTFShape('models/LightsC_Artichoke.glb'))
// artichokeLightsC.addComponent(
//   new Transform({
//     rotation: Quaternion.Euler(0, 180, 0),
//   })
// )
// artichokeLightsC.addComponent(new Animator()).addClip(LightsC)
// engine.addEntity(artichokeLightsC)
// LightsA.stop()
// LightsB.stop()
// LightsC.stop()

const discoTrigger = new Entity()
discoTrigger.addComponent(new Transform({ position: new Vector3(194, 6, 287) }))

let discoTriggerBox = new utils.TriggerBoxShape(
  new Vector3(75, 14, 75),
  Vector3.Zero()
)
discoTrigger.addComponent(
  new utils.TriggerComponent(
    discoTriggerBox, //shape
    0, //layer
    0, //triggeredByLayer
    null, //onTriggerEnter
    null, //onTriggerExit
    () => {
      sceneMessageBus.emit('enteredRadioRange', {})
      isInRadioRange = true
      if (currentRadio) {
        radioOn(currentRadio)
      }

      log('triggered!')
    },
    () => {
      isInRadioRange = false
      radioOff()
    }, //onCameraExit
    false
  )
)
engine.addEntity(discoTrigger)

sceneMessageBus.on('enteredRadioRange', (e) => {
  if (!isInRadioRange || currentRadio == null) return
  sceneMessageBus.emit('setRadio', {
    station: currentRadio,
  })
})
