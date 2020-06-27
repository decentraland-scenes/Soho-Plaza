import { MusicalDrop, drops } from './musicalDrops'
import resources from './resources'
import { changeSequencer } from './serverHandler'

// export const sceneMessageBus = new MessageBus()

export let stones: Stone[] = []

// lightweight storage of sequencer state
export let seqNumbers: number[][] = []

// reusable stone class
export class Stone extends Entity {
  sound: AudioClip
  index: number
  stoneOn: boolean = false
  drop: MusicalDrop
  constructor(
    shape: GLTFShape,
    transform: Transform,
    sound: AudioClip,
    index: number,
    parent: Entity,
    messagebus: MessageBus
  ) {
    super()
    this.setParent(parent)
    engine.addEntity(this)
    this.addComponent(shape)
    this.addComponent(transform)

    // note ID
    this.sound = sound

    this.index = index

    let thisStone = this

    this.addComponent(
      new OnPointerDown(
        (e) => {
          log('toggle stone')
          if (this.stoneOn) {
            messagebus.emit('hideStone', { stone: thisStone.index })
          } else {
            messagebus.emit('showStone', { stone: thisStone.index })
          }
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Toggle',
        }
      )
    )

    this.drop = new MusicalDrop(
      new GLTFShape('models/zenquencer/music-drop.glb'),
      new Transform({
        position: new Vector3(0, 0, 0),
      }),
      this.sound,
      this.index
    )
    this.drop.setParent(this)
    drops.push(this.drop)
  }
}
