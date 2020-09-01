// Sound
const sound = new Entity()
sound.addComponent(new Transform())
sound.setParent(Attachable.PLAYER)
sound.addComponent(
  new AudioSource(new AudioClip('sounds/navigationForward.mp3'))
)
engine.addEntity(sound)

export function playSound() {
  sound.getComponent(AudioSource).playOnce()
}
