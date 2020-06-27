import { sceneMessageBus } from './serverHandler'
import utils from '../../node_modules/decentraland-ecs-utils/index'
import { Button } from './buttons'
import { WearablesScanner } from './scanner'
import { Category } from './wearables'
import Door from './door'

export enum Radios {
  RAVE = 'https://icecast.ravepartyradio.org/ravepartyradio-192.mp3',
  INTERVIEW = 'https://dclcoreradio.com/dclradio.ogg',
  DELTA = 'https://cdn.instream.audio/:9069/stream?_=171cd6c2b6e',
  SIGNS = 'https://edge.singsingmusic.net/MC2.mp3',
  MKLAB = 'https://freeuk13.listen2myradio.com/live.mp3?typeportmount=s2_20223_stream_944192845',
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
    Category.Eyewear,
    sceneMessageBus,
    () => {
      log('SUCCESS')

      //   sceneMessageBus.emit('openDoor', {})
      //   door.addComponentOrReplace(
      // 	new utils.Delay(5000, () => {
      // 	  sceneMessageBus.emit('closeDoor', {})
      // 	})
      //   )
    },
    () => {
      log('REJECTED')

      //sceneMessageBus.emit('closeDoor', {})
    },
    {
      position: new Vector3(191, 0.3, 256),
    }
  )

  let capsuleDoor = new Door(
    new GLTFShape('models/dj-console/door_capsule.glb'),
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
    new utils.TriggerComponent(
      triggerBox, //shape
      0, //layer
      0, //triggeredByLayer
      null, //onTriggerEnter
      null, //onTriggerExit
      () => {
        log('triggered exit door')
        sceneMessageBus.emit('openClubDoor', {})
      },
      null, //onCameraExit
      false
    )
  )
  engine.addEntity(exitTrigger)

  /// CONSOLE
  let baseConsole = new Entity()
  baseConsole.addComponent(new GLTFShape('models/dj-console/dj-capsule.glb'))
  baseConsole.addComponent(
    new Transform({
      position: new Vector3(194.5, 0, 299),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(baseConsole)

  let blueButton = new Button(
    'models/dj-console/blue_button.glb',
    {},
    'BlueButton_Action',
    baseConsole
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

  let greenButton = new Button(
    'models/dj-console/green_button.glb',
    {},
    'GreenButton_Action',
    baseConsole
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

  let violetButton = new Button(
    'models/dj-console/violet_button.glb',
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
    'models/dj-console/red_button.glb',
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
    'models/dj-console/yellow_button.glb',
    {},
    'YellowButton_Action',
    baseConsole
  )

  yellowButton.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('setRadio', {
          station: Radios.MKLAB,
        })
        yellowButton.press()
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: 'MK Lab',
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
}
