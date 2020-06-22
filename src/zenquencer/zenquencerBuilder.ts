import utils from '../../node_modules/decentraland-ecs-utils/index'

import { Stone, stones, seqNumbers } from './stones'
import { getStones } from './serverHandler'
import { sceneMessageBus } from '../modules/serverHandler'
import { loopPlayer, loopDuration } from './musicalDrops'
import resources from './resources'

export function addZenquencer(): void {
  // create trigger area object, setting size and relative position
  let zenquencerTriggerBox = new utils.TriggerBoxShape(
    new Vector3(40, 4, 39),
    new Vector3(0, 2, 0)
  )

  const pool = new Entity()
  pool.addComponent(resources.models.pool)
  pool.addComponent(
    new Transform({
      position: new Vector3(283.9, 0.2, 283),
      rotation: Quaternion.Euler(0, 90, 0),
    })
  )
  pool.addComponent(
    new utils.TriggerComponent(
      zenquencerTriggerBox, //shape
      0, //layer
      0, //triggeredByLayer
      null, //onTriggerEnter
      null, //onTriggerExit
      async function () {
        //onCameraEnter

        updateStones()
        // // Check if the mural has tiles
        // if (tiles.length < 1) {
        //   log('triggered!')
        //   await buildTiles()
        // } else {
        //   await updateMural()
        // }
      },
      null, //onCameraExit
      false //debug
    )
  )
  engine.addEntity(pool)

  let seqOffset = new Vector3(7.5, 0, -3)
  let seqLength = 16

  // Kalimba sounds
  const crystalSounds: AudioClip[] = [
    resources.sounds.crystalNotes.f3,
    resources.sounds.crystalNotes.a3,
    resources.sounds.crystalNotes.c3,
    resources.sounds.crystalNotes.d3,
    resources.sounds.crystalNotes.g3,
    resources.sounds.crystalNotes.c4,
    resources.sounds.crystalNotes.a4,
  ]

  for (let beat = 0; beat < seqLength; beat++) {
    seqNumbers.push([])
    for (let note = 0; note < crystalSounds.length; note++) {
      const currentStone = new Stone(
        resources.models.stone,
        new Transform({
          position: new Vector3(
            seqOffset.x - beat,
            seqOffset.y,
            seqOffset.z + note
          ),
          scale: new Vector3(1, 1, 1),
          rotation: Quaternion.Euler(180, 0, 0),
        }),
        crystalSounds[note],
        beat * 7 + note,
        pool
      )
      currentStone.setParent(pool)

      stones.push(currentStone)
      seqNumbers[beat].push(0)
    }
  }

  ///// Buttons
  let tube = new Entity()
  tube.addComponent(
    new Transform({
      position: new Vector3(0, 0, 0),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  tube.addComponent(new Animator()).addClip(energyAnimation)
  tube.setParent(pool)
  tube.addComponent(resources.models.tube)
  engine.addEntity(tube)

  linear.addComponent(
    new Transform({
      position: new Vector3(11.13, 1.48, -3.85),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  linear.addComponent(resources.models.linearButton)
  linear.setParent(pool)
  engine.addEntity(linear)
  linear.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('seqOn', {})
      },
      { hoverText: 'Loop' }
    )
  )

  random.addComponent(
    new Transform({
      position: new Vector3(11.13, 1.49, -4.33 + 0.7),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  random.addComponent(resources.models.randomButton)
  engine.addEntity(random)
  random.setParent(pool)
  random.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('randomMode', {})
      },
      { hoverText: 'Random' }
    )
  )

  let slow2 = new Entity()
  slow2.addComponent(
    new Transform({
      position: new Vector3(11.13, 1.6, -4.59 + 0.7),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  slow2.addComponent(resources.models.speedButton)
  slow2.setParent(pool)
  engine.addEntity(slow2)
  slow2.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('seqSpeed', { speed: 12 })
      },
      { hoverText: 'Very Slow' }
    )
  )

  let slow1 = new Entity()
  slow1.addComponent(
    new Transform({
      position: new Vector3(11.13, 1.6, -4.53 + 0.7),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  slow1.addComponent(resources.models.speedButton)
  slow1.setParent(pool)
  engine.addEntity(slow1)
  slow1.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('seqSpeed', { speed: 8 })
      },
      { hoverText: 'Slow' }
    )
  )

  let neutral = new Entity()
  neutral.addComponent(
    new Transform({
      position: new Vector3(11.13, 1.6, -4.47 + 0.7),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  neutral.addComponent(resources.models.speedButton)
  neutral.setParent(pool)
  engine.addEntity(neutral)
  neutral.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('seqSpeed', { speed: 4 })
      },
      { hoverText: 'Normal' }
    )
  )

  let fast1 = new Entity()
  fast1.addComponent(
    new Transform({
      position: new Vector3(11.13, 1.6, -4.41 + 0.7),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  fast1.addComponent(resources.models.speedButton)
  fast1.setParent(pool)
  engine.addEntity(fast1)
  fast1.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('seqSpeed', { speed: 2 })
      },
      { hoverText: 'Fast' }
    )
  )

  let fast2 = new Entity()
  fast2.addComponent(
    new Transform({
      position: new Vector3(11.13, 1.6, -4.35 + 0.7),
      rotation: Quaternion.Euler(0, 0, 0),
    })
  )
  fast2.addComponent(resources.models.speedButton)
  fast2.setParent(pool)
  engine.addEntity(fast2)
  fast2.addComponent(
    new OnPointerDown(
      () => {
        sceneMessageBus.emit('seqSpeed', { speed: 1 })
      },
      { hoverText: 'Very Fast' }
    )
  )

  sceneMessageBus.on('seqOn', (e) => {
    loopPlayer.playingMode = 1
    loopPlayer.currentBeat = -1
    loopPlayer.durationLeft = loopDuration
    loopPlayer.currentLoop = 0
    linear.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
    random.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
    neutral.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
    energyAnimation.stop()
    energyAnimation.play()
  })

  sceneMessageBus.on('randomMode', (e) => {
    loopPlayer.playingMode = 2
    loopPlayer.currentBeat = -1
    loopPlayer.durationLeft = loopDuration
    loopPlayer.currentLoop = 0
    random.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
    linear.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
    neutral.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
    energyAnimation.stop()
    energyAnimation.play()
  })

  sceneMessageBus.on('seqOff', (e) => {
    loopPlayer.playingMode = 0
    linear.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
    random.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
    neutral.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
  })

  sceneMessageBus.on('seqSpeed', (e) => {
    if (loopPlayer.playingMode) {
      let newSpeed = e.speed * 4

      log('new duration = ', newSpeed)
      loopPlayer.loopDuration = newSpeed
      loopPlayer.beatDuration = loopPlayer.loopDuration / loopPlayer.beats
      loopPlayer.currentLoop = loopPlayer.currentBeat * loopPlayer.beatDuration

      switch (e.speed) {
        case 12:
          slow2.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          slow1.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          neutral.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          fast1.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          fast2.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          break
        case 8:
          slow2.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          slow1.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          neutral.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          fast1.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          fast2.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          break
        case 4:
          slow2.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          slow1.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          neutral.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          fast1.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          fast2.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          break
        case 2:
          slow2.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          slow1.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          neutral.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          fast1.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          fast2.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          break
        case 1:
          slow2.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          slow1.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
          neutral.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          fast1.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          fast2.getComponent(Transform).rotation = Quaternion.Euler(0, 180, 0)
          break
      }
    } else {
      sceneMessageBus.emit('seqOn', {})
    }
  })

  //setRealm().then()

  async function updateStones() {
    let currentStones = await getStones()
    if (!currentStones) return

    log(currentStones)
    for (let beat = 0; beat < currentStones.length; beat++) {
      for (let note = 0; note < currentStones[beat].length; note++) {
        seqNumbers[beat][note] = currentStones[beat][note]
        let currentStone = stones[beat * 7 + note]
        if (currentStones[beat][note] == 0) {
          currentStone.stoneOn = false

          currentStone.drop.removeComponent(GLTFShape)
        } else {
          currentStone.stoneOn = true
          currentStone.getComponent(Transform).rotation = Quaternion.Euler(
            0,
            0,
            0
          )
          currentStone.drop.addComponentOrReplace(currentStone.drop.shape)
        }
      }
    }
  }
}

// define some entities and components outside the initiate function so they can be called externally
export let linear = new Entity()
export let random = new Entity()
export let energyAnimation = new AnimationState('Energy_Action', {
  looping: false,
})
