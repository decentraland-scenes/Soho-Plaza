import { sceneMessageBus } from './serverHandler'
import * as utils from '@dcl/ecs-scene-utils'
import { Button } from './buttons'
import { WearablesScanner } from './scanner'
import { Category } from './wearables'
import Door from './door'

export enum Radios {
  RAVE = 'https://icecast.ravepartyradio.org/ravepartyradio-192.mp3',
  DELTA = 'https://cdn.instream.audio/:9069/stream?_=171cd6c2b6e',
  GRAFFITI = 'https://n07.radiojar.com/2qm1fc5kb.m4a?1617129761=&rj-tok=AAABeIR7VqwAilDFeUM39SDjmw&rj-ttl=5',
  SIGNS = 'https://edge.singsingmusic.net/MC2.mp3',
  JAZZ = 'https://live.vegascity.fm/radio/8010/the_flamingos.mp3',
}

let isInRadioRange: boolean = false
let currentRadio: Radios | null = null

const musicStreamEnt = new Entity()
engine.addEntity(musicStreamEnt)

let musicStream: AudioStream | null = null

export function addDanceFloor() {
  // Wearables scanner

  let scanner = new WearablesScanner(
    {
      position: new Vector3(191, 0.3, 259),
      rotation: Quaternion.Euler(0, 180, 0),
    },
    'thug',
    sceneMessageBus,
    () => {
      log('SUCCESS')

      //   sceneMessageBus.emit('openClubDoor', {})
      //   capsuleDoor.addComponentOrReplace(
      //     new utils.Delay(5000, () => {
      //       sceneMessageBus.emit('closeDoor', {})
      //     })
      //   )
    },
    () => {
      log('REJECTED')

      //   sceneMessageBus.emit('closeDoor', {})
    },
    {
      position: new Vector3(191, 0.3, 256),
    }
  )

  let capsuleDoor = new Door(
    new GLTFShape('models/door_capsule.glb'),
    {
      rotation: Quaternion.Euler(0, 0, 0),
      position: new Vector3(160, 0, 160),
    },
    'DoorOPEN_Action',
    'DoorCLOSE_Action',
    false,
    true,
    {
      position: new Vector3(195, 1, 262),
      scale: new Vector3(4, 6, 1),
    }
  )

  sceneMessageBus.on('scanning', () => {
    scanner.scan()
  })

  sceneMessageBus.on('scanapprove', () => {
    scanner.approve()
    capsuleDoor.toggle(true)
    capsuleDoor.addComponentOrReplace(
      new utils.Delay(5000, () => {
        capsuleDoor.toggle(false)
        scanner.allowAnim.stop()
      })
    )
  })

  sceneMessageBus.on('scanreject', () => {
    scanner.reject()
    capsuleDoor.toggle(false)
  })

  sceneMessageBus.on('openClubDoor', () => {
    if (capsuleDoor.isOpen) return
    capsuleDoor.toggle(true)
    capsuleDoor.addComponentOrReplace(
      new utils.Delay(5000, () => {
        capsuleDoor.toggle(false)
      })
    )
  })

  let exitTrigger = new Entity()
  exitTrigger.addComponent(
    new Transform({
      position: new Vector3(194, 2, 264.5),
    })
  )
  let triggerBox = new utils.TriggerBoxShape(
    new Vector3(2, 2, 2),
    Vector3.Zero()
  )

  exitTrigger.addComponent(
    new utils.TriggerComponent(triggerBox, {
      onCameraEnter: () => {
        log('triggered exit door')
        sceneMessageBus.emit('openClubDoor', {})
      },
    })
  )
  engine.addEntity(exitTrigger)

  /// CONSOLE
  let baseConsole = new Entity()
  baseConsole.addComponent(new GLTFShape('models/dj-capsule.glb'))
  baseConsole.addComponent(
    new Transform({
      position: new Vector3(194.5, 0, 299),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(baseConsole)

  let blueButton = new Button(
    'models/buttons/blue_button.glb',
    {},
    'BlueButton_Action',
    baseConsole
  )

  blueButton.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('setRadio', {
          station: Radios.JAZZ,
        })
        blueButton.press()
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: 'Jazz',
      }
    )
  )

  let greenButton = new Button(
    'models/buttons/green_button.glb',
    {},
    'GreenButton_Action',
    baseConsole
  )

  greenButton.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('setRadio', {
          station: Radios.GRAFFITI,
        })
        greenButton.press()
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: 'Graffiti',
      }
    )
  )

  let violetButton = new Button(
    'models/buttons/violet_button.glb',
    {},
    'VioletButton_Action',
    baseConsole
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

  let redButton = new Button(
    'models/buttons/red_button.glb',
    {},
    'RedButton_Action',
    baseConsole
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

  let yellowButton = new Button(
    'models/buttons/yellow_button.glb',
    {},
    'YellowButton_Action',
    baseConsole
  )

  yellowButton.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('setRadio', {
          station: Radios.RAVE,
        })
        yellowButton.press()
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: 'Rave',
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
    if (musicStream) {
      musicStream.playing = false
    }
  }

  const discoTrigger = new Entity()
  discoTrigger.addComponent(
    new Transform({ position: new Vector3(194, 6, 287) })
  )

  let discoTriggerBox = new utils.TriggerBoxShape(
    new Vector3(75, 14, 75),
    Vector3.Zero()
  )
  discoTrigger.addComponent(
    new utils.TriggerComponent(discoTriggerBox, {
      onCameraEnter: () => {
        sceneMessageBus.emit('enteredRadioRange', {})
        isInRadioRange = true
        if (currentRadio) {
          radioOn(currentRadio)
        }

        log('triggered!')
      },
      onCameraExit: () => {
        isInRadioRange = false
        radioOff()
      },
    })
  )
  engine.addEntity(discoTrigger)

  sceneMessageBus.on('enteredRadioRange', (e) => {
    if (!isInRadioRange || currentRadio == null) return
    sceneMessageBus.emit('setRadio', {
      station: currentRadio,
    })
  })
}
