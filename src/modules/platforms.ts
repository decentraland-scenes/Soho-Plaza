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

  // Skateboard 1
  let skate_01 = new Platform(
    new GLTFShape('models/skate_01.glb'),
    {
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    },
    { position: new Vector3(142.3, 10, 215.3) },
    new Vector3(0.75, 2, 1.5),
    'Skate_Action',
    'skate1'
  )

  let arrow1 = new Entity()
  arrow1.addComponent(new GLTFShape('models/Arrow.glb'))
  arrow1.addComponent(
    new Transform({
      position: new Vector3(142.3, 9.5, 215.8),
    })
  )
  engine.addEntity(arrow1)

  let skate01IsMoving: boolean = false

  sceneMessageBus.on('skate1', (e) => {
    if (skate01IsMoving) {
      log('skate was already moving')
      return
    }
    arrow1.getComponent(GLTFShape).visible = false
    skate01IsMoving = true
    skate_01.activate()
    skate_01.addComponentOrReplace(
      new utils.Delay((2000 / 28) * 1000, () => {
        skate01IsMoving = false
        arrow1.getComponent(GLTFShape).visible = true
        //skate_01.animation.stop()
      })
    )
  })

  // Skateboard 2
  let skate_02 = new Platform(
    new GLTFShape('models/skate_02.glb'),
    {
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    },
    { position: new Vector3(142.25, 5, 158.8) },
    new Vector3(0.75, 2, 1.5),
    'Skate_02_Action',
    'skate2'
  )

  let arrow2 = new Entity()
  arrow2.addComponent(new GLTFShape('models/Arrow.glb'))
  arrow2.addComponent(
    new Transform({
      position: new Vector3(142.3, 5, 158.8),
    })
  )
  engine.addEntity(arrow2)

  let skate02IsMoving: boolean = false

  sceneMessageBus.on('skate2', (e) => {
    if (skate02IsMoving) {
      log('skate was already moving')
      return
    }
    arrow2.getComponent(GLTFShape).visible = false
    skate02IsMoving = true
    skate_02.activate()
    skate_02.addComponentOrReplace(
      new utils.Delay((1200 / 28) * 1000, () => {
        skate02IsMoving = false
        arrow2.getComponent(GLTFShape).visible = true
        //skate_02.animation.stop()
      })
    )
  })

  //   //add Car_Body
  //   let Car_Body = new Entity()
  //   Car_Body.addComponent(new GLTFShape('models/Car_Body.glb'))
  //   Car_Body.addComponent(
  //     new Transform({
  //       position: new Vector3(160, 0, 160),
  //       rotation: Quaternion.Euler(0, 0, 0),
  //     })
  //   )
  //   engine.addEntity(Car_Body)
  //   Car_Body.addComponent(new Animator())
  //   let carAnim = new AnimationState('Action.002', {
  //     looping: false,
  //   })
  //   Car_Body.getComponent(Animator).addClip(carAnim)

  //   //add WheelBack_L
  //   let WheelBack_L = new Entity()
  //   WheelBack_L.addComponent(new GLTFShape('models/WheelBack_L.glb'))
  //   WheelBack_L.addComponent(
  //     new Transform({
  //       position: new Vector3(160, 0, 160),
  //       rotation: Quaternion.Euler(0, 0, 0),
  //     })
  //   )
  //   engine.addEntity(WheelBack_L)
  //   WheelBack_L.addComponent(new Animator())
  //   let WheelBack_LAnim = new AnimationState('Action.006', {
  //     looping: false,
  //   })
  //   WheelBack_L.getComponent(Animator).addClip(WheelBack_LAnim)

  //   //add WheelBack_R
  //   let WheelBack_R = new Entity()
  //   WheelBack_R.addComponent(new GLTFShape('models/WheelBack_R.glb'))
  //   WheelBack_R.addComponent(
  //     new Transform({
  //       position: new Vector3(160, 0, 160),
  //       rotation: Quaternion.Euler(0, 0, 0),
  //     })
  //   )
  //   engine.addEntity(WheelBack_R)
  //   WheelBack_R.addComponent(new Animator())
  //   let WheelBack_RAnim = new AnimationState('Action.007', {
  //     looping: false,
  //   })
  //   WheelBack_R.getComponent(Animator).addClip(WheelBack_RAnim)

  //   //add WheelFront_L
  //   let WheelFront_L = new Entity()
  //   WheelFront_L.addComponent(new GLTFShape('models/WheelFront_L.glb'))
  //   WheelFront_L.addComponent(
  //     new Transform({
  //       position: new Vector3(160, 0, 160),
  //       rotation: Quaternion.Euler(0, 0, 0),
  //     })
  //   )
  //   engine.addEntity(WheelFront_L)
  //   WheelFront_L.addComponent(new Animator())
  //   let WheelFront_LAnim = new AnimationState('Action.005', {
  //     looping: false,
  //   })
  //   WheelFront_L.getComponent(Animator).addClip(WheelFront_LAnim)

  //   //add WheelFront_R
  //   let WheelFront_R = new Entity()
  //   WheelFront_R.addComponent(new GLTFShape('models/WheelFront_R.glb'))
  //   WheelFront_R.addComponent(
  //     new Transform({
  //       position: new Vector3(160, 0, 160),
  //       rotation: Quaternion.Euler(0, 0, 0),
  //     })
  //   )
  //   engine.addEntity(WheelFront_R)
  //   WheelFront_R.addComponent(new Animator())
  //   let WheelFront_RAnim = new AnimationState('Action.001', {
  //     looping: false,
  //   })
  //   WheelFront_R.getComponent(Animator).addClip(WheelFront_RAnim)

  //   const totalCarTime: number = 100

  //   class CarTimerSystem implements ISystem {
  //     carTimer: number = totalCarTime
  //     update(dt: number) {
  //       this.carTimer -= dt
  //       if (this.carTimer < 0) {
  //         this.carTimer = totalCarTime
  //         resetCarAnims()
  //         log('RESETTING CARS')
  //       }
  //     }
  //   }

  //   engine.addSystem(new CarTimerSystem())

  //   function resetCarAnims() {
  //     carAnim.stop()
  //     WheelFront_LAnim.stop()
  //     WheelFront_RAnim.stop()
  //     WheelBack_LAnim.stop()
  //     WheelBack_RAnim.stop()

  //     carAnim.play()
  //     WheelFront_LAnim.play()
  //     WheelFront_RAnim.play()
  //     WheelBack_LAnim.play()
  //     WheelBack_RAnim.play()
  //   }

  //   sceneMessageBus.emit('getcartime', {})
}
