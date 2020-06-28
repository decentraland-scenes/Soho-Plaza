import { sceneMessageBus } from './serverHandler'
import utils from '../../node_modules/decentraland-ecs-utils/index'
import { Switch } from './buttons'

export enum Songs {
  song1 = 'sounds/boombox/Freestyle-Type-Beat-Real_Free-Type-Beat-2020-Rap-Trap-Instrumental.mp3',
  song2 = 'sounds/boombox/Gunna-x-Lil-Baby-Type-Beat-Too-Cold-(ProdByKairo).mp3',
  song3 = 'sounds/boombox/INFECTED-HARD-BASS-TYPE BEAT.mp3',
}

export default class BoomBox extends Entity {
  music1: string
  music2: string
  music3: string
  button1Model: string
  button1Anim: string
  button1OffAnim: string
  button2Model: string
  button2Anim: string
  button2OffAnim: string
  button3Model: string
  button3Anim: string
  button3OffAnim: string
  playing: boolean = false
  songPlaying: number = 0
  switch1: Switch
  switch2: Switch
  switch3: Switch

  constructor(
    position: TranformConstructorArgs,
    music1: string,
    music2: string,
    music3: string,
    button1Model: string,
    button1Anim: string,
    button1OffAnim: string,
    button2Model: string,
    button2Anim: string,
    button2OffAnim: string,
    button3Model: string,
    button3Anim: string,
    button3OffAnim: string
  ) {
    super()

    this.addComponent(new GLTFShape('models/Boombox.glb'))
    this.addComponent(new Transform(position))

    const animator = new Animator()
    const switchClip = new AnimationState('ON_OFF_Action', { looping: false })
    const playingClip = new AnimationState('Music_Action', { looping: true })
    animator.addClip(switchClip)
    animator.addClip(playingClip)
    this.addComponent(animator)

    engine.addEntity(this)

    this.music1 = music1
    this.music2 = music2
    this.music3 = music3

    this.switch1 = new Switch(
      button1Model,
      {
        position: new Vector3(0, 0.5, -0.05),
      },

      button1Anim,
      button1OffAnim,
      this
    )
    this.switch2 = new Switch(
      button2Model,
      {
        position: new Vector3(0, 0.5, -0.05),
      },
      button2Anim,
      button2OffAnim,
      this
    )
    this.switch3 = new Switch(
      button3Model,
      {
        position: new Vector3(0, 0.5, -0.05),
      },
      button3Anim,
      button3OffAnim,
      this
    )

    let thisBoombox = this

    this.switch1.addComponent(
      new OnPointerDown(
        (e) => {
          if (thisBoombox.songPlaying !== 1 || !thisBoombox.playing) {
            sceneMessageBus.emit('boombox', { song: 1 })
          } else {
            sceneMessageBus.emit('boomboxOff', {})
          }
        },
        { hoverText: 'song 1' }
      )
    )

    this.switch2.addComponent(
      new OnPointerDown(
        (e) => {
          if (thisBoombox.songPlaying !== 2 || !thisBoombox.playing) {
            sceneMessageBus.emit('boombox', { song: 2 })
          } else {
            sceneMessageBus.emit('boomboxOff', {})
          }
        },
        { hoverText: 'song 2' }
      )
    )

    this.switch3.addComponent(
      new OnPointerDown(
        (e) => {
          if (thisBoombox.songPlaying !== 3 || !thisBoombox.playing) {
            sceneMessageBus.emit('boombox', { song: 3 })
          } else {
            sceneMessageBus.emit('boomboxOff', {})
          }
        },
        { hoverText: 'song 3' }
      )
    )
  }

  toggle(value: boolean) {
    const animator = this.getComponent(Animator)
    //const switchClip = animator.getClip('ON_OFF_Action')
    const playingClip = animator.getClip('Music_Action')
    this.playing = value

    // switchClip.stop()
    // switchClip.play()

    if (value) {
      playingClip.playing = true
    //   this.addComponentOrReplace(
    //     new utils.Delay(40000, () => {
    //       playingClip.playing = false
    //       this.playing = false
    //     })
      )
    } else {
      playingClip.playing = false
    }
  }
}

let boombox = new BoomBox(
  {
    position: new Vector3(156.5, 5.24, 119),
    rotation: Quaternion.Euler(0, -15, 0),
  },
  Songs.song1,
  Songs.song2,
  Songs.song3,
  'models/buttons/VioletSwitch.glb',
  'ButtonVioletON_Action',
  'ButtonVioletOFF_Action',
  'models/buttons/RedSwitch.glb',
  'RedButtonON_Action',
  'RedButtonOFF_Action',
  'models/buttons/YellowSwitch.glb',
  'YellowButtonON_Action',
  'YellowButtonOFF_Action'
)

sceneMessageBus.on('boombox', (e) => {
  log('play song ', e.song)

  if (boombox.playing && boombox.songPlaying !== e.song) {
    switch (boombox.songPlaying) {
      case 1:
        boombox.switch1.toggle(false)
        break
      case 2:
        boombox.switch2.toggle(false)
        break
      case 3:
        boombox.switch3.toggle(false)
        break
    }
  }

  boombox.toggle(true)
  boombox.songPlaying = e.song

  switch (e.song) {
    case 1:
      boombox.switch1.toggle(true)
      boombox.addComponentOrReplace(
        new AudioSource(new AudioClip(boombox.music1))
	  )
	  boombox.getComponent(AudioSource).loop = true
      boombox.getComponent(AudioSource).playing = true
      break
    case 2:
      boombox.switch2.toggle(true)
      boombox.addComponentOrReplace(
        new AudioSource(new AudioClip(boombox.music2))
	  )
	  boombox.getComponent(AudioSource).loop = true
      boombox.getComponent(AudioSource).playing = true
      break
    case 3:
      boombox.switch3.toggle(true)
      boombox.addComponentOrReplace(
        new AudioSource(new AudioClip(boombox.music3))
	  )
	  boombox.getComponent(AudioSource).loop = true
      boombox.getComponent(AudioSource).playing = true
      break
  }
})

sceneMessageBus.on('boomboxOff', (e) => {
  log('Music off')
  if (boombox.playing) {
    switch (boombox.songPlaying) {
      case 1:
        boombox.switch1.toggle(false)
        break
      case 2:
        boombox.switch2.toggle(false)
        break
      case 3:
        boombox.switch3.toggle(false)
        break
    }
    boombox.toggle(false)
    boombox.songPlaying = 0

    if (boombox.hasComponent(AudioSource)) {
      boombox.addComponentOrReplace(
        new AudioSource(new AudioClip(boombox.music1))
      )
      boombox.getComponent(AudioSource).playing = false
    }
  }
})

boombox.addComponent(
  new OnPointerDown((e) => {
    openNFTDialog('ethereum://0x03f41eaa68968a4443ecee18139637c59c8f7b6b/70')
  })
)
