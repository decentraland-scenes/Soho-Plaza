export default {
  models: {
    pool: new GLTFShape('models/zenquencer/pool.glb'),
    stone: new GLTFShape('models/zenquencer/stone.glb'),
    linearButton: new GLTFShape('models/zenquencer/linear.glb'),
    randomButton: new GLTFShape('models/zenquencer/random.glb'),
    speedButton: new GLTFShape('models/zenquencer/speedButton.glb'),
    tube: new GLTFShape('models/zenquencer/tube.glb'),
  },
  sounds: {
    crystalNotes: {
      a3: new AudioClip('sounds/zenquencer/1A.mp3'),
      c3: new AudioClip('sounds/zenquencer/2C.mp3'),
      d3: new AudioClip('sounds/zenquencer/3D.mp3'),
      f3: new AudioClip('sounds/zenquencer/4F.mp3'),
      g3: new AudioClip('sounds/zenquencer/5G.mp3'),
      a4: new AudioClip('sounds/zenquencer/6A1.mp3'),
      c4: new AudioClip('sounds/zenquencer/7C1.mp3'),
    },
  },
}
