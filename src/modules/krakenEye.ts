export function followingEye() {
  let krakenEye = new Entity()

  krakenEye.addComponent(
    new Transform({
      position: new Vector3(181.6, 24.5, 198.8),
      rotation: Quaternion.Zero(),
    })
  )

  krakenEye.addComponent(new GLTFShape('models/eye.glb'))
  engine.addEntity(krakenEye)

  class KrakenWatch implements ISystem {
    timer: number = 0
    checkInterval: number
    startRot: Quaternion = krakenEye.getComponent(Transform).rotation.clone()
    endRot: Quaternion
    fraction: number = 0
    rotating: boolean = false
    rotSpeed: number
    easeIn: number

    constructor(checkInterval: number, rotSpeed: number, easeIn: number) {
      this.checkInterval = checkInterval
      this.rotSpeed = rotSpeed
      this.easeIn = easeIn
    }
    update(dt: number) {
      this.timer += dt
      if (this.timer > this.checkInterval) {
        this.timer = 0
        //log('interval')
        this.getAngle()
      }

      if (this.rotating) {
        let transform = krakenEye.getComponent(Transform)
        if (this.fraction <= 1) {
          let easedInIndex = -(Math.cos(Math.PI * this.fraction) - 1) / 2
          let rot = Quaternion.Slerp(this.startRot, this.endRot, easedInIndex)
          transform.rotation = rot
          this.fraction += dt
        } else {
          this.rotating = false
        }
      }
    }
    getAngle() {
      let eyePos = krakenEye.getComponent(Transform).position
      let playerPos = Camera.instance.position

      let direction = eyePos.subtract(playerPos)

      log('distance :', direction.lengthSquared(), ' dir: ', direction)

      if (direction.lengthSquared() > 10000) return
      this.rotating = true
      this.fraction = 0
      this.startRot = krakenEye.getComponent(Transform).rotation.clone()
      this.endRot = Quaternion.LookRotation(direction, Vector3.Up()) //FromToRotation(eyePos, playerPos)
    }
  }

  engine.addSystem(new KrakenWatch(5, 3, 1))
}
