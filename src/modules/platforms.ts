import utils from '../../node_modules/decentraland-ecs-utils/index'
import { sceneMessageBus } from './serverHandler'
import Door from './door'
import { Button } from './buttons'

/// Reusable class for all platforms
export class Platform extends Entity {
  model: GLTFShape
  animation: AnimationState

  constructor(
    model: GLTFShape,
    platformPos: TranformConstructorArgs,
    triggerPos: TranformConstructorArgs,
    triggerScale: Vector3,
    animation: string,
    messageBusHandle: string
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(model)
    this.addComponent(new Transform(platformPos))

    this.addComponent(new Animator())

    this.animation = new AnimationState(animation, { looping: false })
    this.getComponent(Animator).addClip(this.animation)

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
          log('triggered platform')
          sceneMessageBus.emit(messageBusHandle, {})
        },
        null, //onCameraExit
        false //true
      )
    )
    engine.addEntity(triggerEntity)
  }

  public activate(): void {
    this.animation.stop()
    this.animation.play()
  }
}

/// Reusable class for all platforms
export class TwoWayPlatform extends Entity {
  model: GLTFShape
  animationUp: AnimationState
  animationDown: AnimationState
  moving: boolean = false
  speed: number
  isUp: boolean = false

  constructor(
    model: GLTFShape,
    platformPos: TranformConstructorArgs,
    trigger1Pos: TranformConstructorArgs,
    trigger2Pos: TranformConstructorArgs,
    triggerScale: Vector3,
    animationUp: string,
    animationDown: string,
    messageBusHandleUp: string,
    messageBusHandleDown: string,
    speed: number
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(model)
    this.addComponent(new Transform(platformPos))

    this.speed = speed

    this.addComponent(new Animator())

    this.animationUp = new AnimationState(animationUp, { looping: false })
    this.getComponent(Animator).addClip(this.animationUp)

    this.animationDown = new AnimationState(animationDown, { looping: false })
    this.getComponent(Animator).addClip(this.animationDown)

    let triggerBox = new utils.TriggerBoxShape(triggerScale, Vector3.Zero())

    const trigger1Entity = new Entity()
    trigger1Entity.addComponent(new Transform(trigger1Pos))

    trigger1Entity.addComponent(
      new utils.TriggerComponent(
        triggerBox, //shape
        0, //layer
        0, //triggeredByLayer
        null, //onTriggerEnter
        null, //onTriggerExit
        () => {
          if (this.moving) return
          log('triggered platform')
          sceneMessageBus.emit(messageBusHandleUp, {})
        },
        null, //onCameraExit
        false //true
      )
    )
    engine.addEntity(trigger1Entity)

    const trigger2Entity = new Entity()
    trigger2Entity.addComponent(new Transform(trigger2Pos))

    trigger2Entity.addComponent(
      new utils.TriggerComponent(
        triggerBox, //shape
        0, //layer
        0, //triggeredByLayer
        null, //onTriggerEnter
        null, //onTriggerExit
        () => {
          if (this.moving) return
          log('triggered platform')
          sceneMessageBus.emit(messageBusHandleDown, {})
        },
        null, //onCameraExit
        false //true
      )
    )
    engine.addEntity(trigger2Entity)
  }

  public up(): void {
    if (this.isUp) return
    this.moving = true
    this.animationDown.stop()
    this.animationUp.stop()
    this.animationUp.play()
    this.addComponentOrReplace(
      new utils.Delay(this.speed, () => {
        this.moving = false
        this.isUp = true
      })
    )
  }

  public down(): void {
    if (!this.isUp) return
    this.moving = true
    this.animationUp.stop()
    this.animationDown.stop()
    this.animationDown.play()
    this.addComponentOrReplace(
      new utils.Delay(this.speed, () => {
        this.moving = false
        this.isUp = false
      })
    )
  }
}

export function placePlatforms() {
  //  ELEVATOR
  let elevator = new TwoWayPlatform(
    new GLTFShape('models/elevator/Elevator.glb'),
    { rotation: Quaternion.Euler(0, 0, 0), position: new Vector3(160, 0, 160) },
    { position: new Vector3(19, 2, 21.5) },
    { position: new Vector3(19, 16, 21.5) },
    new Vector3(5, 5, 5),
    'ElevatorUP_Action',
    'ElevatorDOWN_Action',
    'elevatorUp',
    'elevatorDown',
    6000
  )

  sceneMessageBus.on('elevatorUp', (e) => {
    elevator.up()

    bottomDoor.toggle(false)
    log('elevator going up')
    topDoor.addComponentOrReplace(
      new utils.Delay(6000, () => {
        topDoor.toggle(true)
      })
    )
  })

  sceneMessageBus.on('elevatorDown', (e) => {
    elevator.down()
    topDoor.toggle(false)

    log('elevator going down')
    bottomDoor.addComponentOrReplace(
      new utils.Delay(6000, () => {
        bottomDoor.toggle(true)
      })
    )
  })

  let topDoor = new Door(
    new GLTFShape('models/elevator/DoorFirstFloor.glb'),
    { rotation: Quaternion.Euler(0, 0, 0), position: new Vector3(160, 0, 160) },
    'DoorElevatorFirstFloorOPEN_Action',
    'DoorElevatorFirstFloorCLOSE_Action'
  )

  let bottomDoor = new Door(
    new GLTFShape('models/elevator/DoorBottomFloor.glb'),
    { rotation: Quaternion.Euler(0, 0, 0), position: new Vector3(160, 0, 160) },
    'DoorBottomElevatorOPEN_Action',
    'DoorBottomElevatorCLOSE_Action'
  )

  let upButton = new Button(
    'models/elevator/Button.glb',
    {
      rotation: Quaternion.Euler(0, 0, 0),
      position: new Vector3(21.7, 1.8, 23.8),
    },
    'Button_Action'
  )

  upButton.addComponent(
    new OnPointerDown(() => {
      sceneMessageBus.emit('callElevatorDown', {})
    })
  )

  sceneMessageBus.on('callElevatorDown', () => {
    upButton.press()
    if (elevator.isUp) {
      topDoor.toggle(false)
      elevator.down()
      upButton.addComponentOrReplace(
        new utils.Delay(6000, () => {
          bottomDoor.toggle(true)
        })
      )
    } else bottomDoor.toggle(true)
  })

  let downButton = new Button(
    'models/elevator/Button.glb',
    {
      rotation: Quaternion.Euler(180, 0, 0),
      position: new Vector3(21.7, 16, 23.8),
    },
    'Button_Action'
  )

  downButton.addComponent(
    new OnPointerDown(() => {
      sceneMessageBus.emit('callElevatorUp', {})
    })
  )

  sceneMessageBus.on('callElevatorUp', () => {
    downButton.press()
    if (!elevator.isUp) {
      bottomDoor.toggle(false)
      elevator.up()
      downButton.addComponentOrReplace(
        new utils.Delay(6000, () => {
          topDoor.toggle(true)
        })
      )
    } else topDoor.toggle(true)
  })

  //button

  // doors
  //
  //   // WHALE ELEVATOR
  //   let whale_Elevator = new Platform(
  //     new GLTFShape('models/TheWhale_Action_Elevator.glb'),
  //     { rotation: Quaternion.Euler(0, 180, 0) },
  //     { position: new Vector3(188.5, 3, 236) },
  //     new Vector3(7, 3, 7),
  //     'WhaleElevator_Action',
  //     'whaleElevatorActivated'
  //   )
  //   //// MOON TOWER ELEVATOR
  //   let moonTower_Elevator = new Platform(
  //     new GLTFShape('models/MoonTower_Action_Elevator.glb'),
  //     { rotation: Quaternion.Euler(0, 180, 0) },
  //     { position: new Vector3(48.6, 2.4, 116.6) },
  //     new Vector3(7, 3, 7),
  //     'MoonTower_Action_Elevator',
  //     'moonElevatorActivated'
  //   )
  //   ///////  SHELL ELEVATOR
  //   let shell_elevator = new Platform(
  //     new GLTFShape('models/shell_elevator.glb'),
  //     { rotation: Quaternion.Euler(0, 180, 0) },
  //     {
  //       position: new Vector3(300.5, 11.3, 120),
  //       rotation: Quaternion.Euler(0, 45, 0),
  //     },
  //     new Vector3(7, 2, 6),
  //     'TheShell_ElevatorAction',
  //     'shellElevatorActivated'
  //   )
  //   ///////  TRAIN ELEVATOR
  //   let train_elevator = new Platform(
  //     new GLTFShape('models/train_elevator.glb'),
  //     { rotation: Quaternion.Euler(0, 180, 0) },
  //     {
  //       position: new Vector3(229.7, 1.3, 143),
  //       rotation: Quaternion.Euler(0, 45, 0),
  //     },
  //     new Vector3(2, 2, 2),
  //     'TrainElevator_Action',
  //     'trainElevatorActivated'
  //   )
  //   //// BALOOON
  //   let ballonIsFlying: boolean = false
  //   let balloon = new Platform(
  //     new GLTFShape('models/balloon.glb'),
  //     { rotation: Quaternion.Euler(0, 180, 0) },
  //     {
  //       position: new Vector3(80, 2, 181),
  //       rotation: Quaternion.Euler(0, 45, 0),
  //     },
  //     new Vector3(2, 1, 2),
  //     'Balloon_Action',
  //     'balloonActivated'
  //   )
  //   // TRAIN
  //   let trainIsMoving: boolean = false
  //   let train = new Platform(
  //     new GLTFShape('models/train.glb'),
  //     { rotation: Quaternion.Euler(0, 180, 0) },
  //     {
  //       position: new Vector3(234.5, 7, 143),
  //       rotation: Quaternion.Euler(0, 45, 0),
  //     },
  //     new Vector3(2, 2, 6),
  //     'Train_Action',
  //     'trainActivated'
  //   )
  //   sceneMessageBus.on('artichokeElevatorActivated', (e) => {
  //     artichoke_Elevator.activate()
  //     log('artichoke elevator')
  //   })
  //   sceneMessageBus.on('whaleElevatorActivated', (e) => {
  //     whale_Elevator.activate()
  //     log('whale elevator')
  //   })
  //   sceneMessageBus.on('moonElevatorActivated', (e) => {
  //     moonTower_Elevator.activate()
  //     log('moon tower elevator')
  //   })
  //   sceneMessageBus.on('shellElevatorActivated', (e) => {
  //     shell_elevator.activate()
  //     log('shell elevator')
  //   })
  //   sceneMessageBus.on('trainElevatorActivated', (e) => {
  //     train_elevator.activate()
  //     log('train elevator')
  //   })
  //   sceneMessageBus.on('balloonActivated', (e) => {
  //     if (ballonIsFlying) {
  //       log('baloon was already in flight')
  //       return
  //     }
  //     ballonIsFlying = true
  //     balloon.activate()
  //     balloon.addComponentOrReplace(
  //       new utils.Delay(150 * 1000, () => {
  //         ballonIsFlying = false
  //       })
  //     )
  //   })
  //   sceneMessageBus.on('trainActivated', (e) => {
  //     if (trainIsMoving) {
  //       log('train was already in movement')
  //       return
  //     }
  //     trainIsMoving = true
  //     train.activate()
  //     train.addComponentOrReplace(
  //       new utils.Delay(100 * 1000, () => {
  //         trainIsMoving = false
  //       })
  //     )
  //   })
}
