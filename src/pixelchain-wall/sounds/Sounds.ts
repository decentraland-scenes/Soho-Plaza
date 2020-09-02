// Sound
const sound = new Entity()
sound.addComponent(new Transform())
sound.addComponent(
  new AudioSource(new AudioClip('sounds/navigationForward.mp3'))
)
engine.addEntity(sound)
sound.setParent(Attachable.PLAYER)

export function playSound() {
  sound.getComponent(AudioSource).playOnce()
}
