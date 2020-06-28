import utils from '../../node_modules/decentraland-ecs-utils/index'
import { sceneMessageBus } from './serverHandler'
import Door from './door'
import { Button } from './buttons'
import { setTimeout } from '../pixelchain-wall/Utils'

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
    new GLTFShape('models/Elevator.glb'),
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
    new GLTFShape('models/DoorFirstFloor.glb'),
    { rotation: Quaternion.Euler(0, 0, 0), position: new Vector3(160, 0, 160) },
    'DoorElevatorFirstFloorOPEN_Action',
    'DoorElevatorFirstFloorCLOSE_Action'
  )

  let bottomDoor = new Door(
    new GLTFShape('models/DoorBottomFloor.glb'),
    { rotation: Quaternion.Euler(0, 0, 0), position: new Vector3(160, 0, 160) },
    'DoorBottomElevatorOPEN_Action',
    'DoorBottomElevatorCLOSE_Action'
  )

  let upButton = new Button(
    'models/ElevatorButton.glb',
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
    'models/ElevatorButton.glb',
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
      new utils.Delay((2000 / 25) * 1000, () => {
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
      new utils.Delay((1200 / 25) * 1000, () => {
        skate02IsMoving = false
        arrow2.getComponent(GLTFShape).visible = true
        //skate_02.animation.stop()
      })
    )
  })

  //ADD CAR_01

  //add Car_01
  let Car_01 = new Entity()
  Car_01.addComponent(new GLTFShape('models/Car_01.glb'))
  Car_01.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(Car_01)
  Car_01.addComponent(new Animator())
  let carAnim = new AnimationState('Car_Action', {
    looping: false,
  })
  Car_01.getComponent(Animator).addClip(carAnim)

  //add Car_01_Collider
  let Car_01_Collider = new Entity()
  Car_01_Collider.addComponent(new GLTFShape('models/Car_01_Collider.glb'))
  Car_01_Collider.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(Car_01_Collider)
  Car_01_Collider.addComponent(new Animator())
  let carColliderAnim = new AnimationState('Action.001', {
    looping: false,
  })
  Car_01_Collider.getComponent(Animator).addClip(carColliderAnim)

  //add Car_02
  let Car_02 = new Entity()
  Car_02.addComponent(new GLTFShape('models/Car_02.glb'))
  Car_02.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(Car_02)
  Car_02.addComponent(new Animator())
  let car2Anim = new AnimationState('Car_02_Action', {
    looping: false,
  })
  Car_02.getComponent(Animator).addClip(car2Anim)

  //add Car_02_Collider
  let Car_02_Collider = new Entity()
  Car_02_Collider.addComponent(new GLTFShape('models/Car_02_Collider.glb'))
  Car_02_Collider.addComponent(
    new Transform({
      position: new Vector3(160, 0, 160),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  engine.addEntity(Car_02_Collider)
  Car_02_Collider.addComponent(new Animator())
  let car2ColliderAnim = new AnimationState('Car_02_Action.001', {
    looping: false,
  })
  Car_02_Collider.getComponent(Animator).addClip(car2ColliderAnim)

  const totalCar1Time: number = 3000 / 25
  const totalCar2Time: number = 1500 / 25

  class CarTimerSystem implements ISystem {
    car1Timer: number = totalCar1Time
	car2Timer: number = totalCar2Time
	synced: boolean = false
    update(dt: number) {
		if (!this.synced){ return}
      this.car1Timer -= dt
      this.car2Timer -= dt
      if (this.car1Timer < 0) {
        this.car1Timer = totalCar1Time
        resetCar1Anims()
        log('RESETTING CARS')
      }
      if (this.car2Timer < 0) {
        this.car2Timer = totalCar2Time
        resetCar2Anims()
        log('RESETTING CARS')
      }
    }
  }

  let carTimes = new CarTimerSystem()
  engine.addSystem(carTimes)

  function resetCar1Anims() {
    carAnim.stop()
    carColliderAnim.stop()

    carAnim.play()
    carColliderAnim.play()
  }

  function resetCar2Anims() {
    car2Anim.stop()
    car2ColliderAnim.stop()

    car2Anim.play()
    car2ColliderAnim.play()
  }

  setTimeout(2000, () => {
    sceneMessageBus.emit('getcartimes', {})

    sceneMessageBus.on('getcartimes', (e, sender) => {
      if (sender !== 'self' && carTimes.synced) {
        this.messageBus.emit('herearecars', {
          car1: carTimes.car1Timer,
          car2: carTimes.car2Timer,
        })
      }
    })

    sceneMessageBus.on('herearecars', (e, sender) => {
      if (sender !== 'self') {
		  carTimes.synced = true
        carTimes.car1Timer = e.car1
        carTimes.car2Timer = e.car2
      }
	})
	setTimeout(2000, () => {
		carTimes.synced = true
	}

  })
}
