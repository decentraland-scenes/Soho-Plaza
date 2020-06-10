import utils from '../node_modules/decentraland-ecs-utils/index'

export default {
  sounds: {
    ui: {
      navigationForward: new AudioClip('sounds/navigationForward.mp3'),
      navigationBackward: new AudioClip('sounds/navigationBackward.mp3'),
    },
    piano: {
      whiteKeys: {
        c3: new AudioClip('sounds/piano/c3.mp3'),
        d3: new AudioClip('sounds/piano/d3.mp3'),
        e3: new AudioClip('sounds/piano/e3.mp3'),
        f3: new AudioClip('sounds/piano/f3.mp3'),
        g3: new AudioClip('sounds/piano/g3.mp3'),
        a3: new AudioClip('sounds/piano/a3.mp3'),
        b3: new AudioClip('sounds/piano/b3.mp3'),
        c4: new AudioClip('sounds/piano/c4.mp3'),
        d4: new AudioClip('sounds/piano/d4.mp3'),
        e4: new AudioClip('sounds/piano/e4.mp3'),
        f4: new AudioClip('sounds/piano/f4.mp3'),
        g4: new AudioClip('sounds/piano/g4.mp3'),
        a4: new AudioClip('sounds/piano/a4.mp3'),
        b4: new AudioClip('sounds/piano/b4.mp3'),
        c5: new AudioClip('sounds/piano/c5.mp3'),
        d5: new AudioClip('sounds/piano/d5.mp3'),
        e5: new AudioClip('sounds/piano/e5.mp3'),
        f5: new AudioClip('sounds/piano/f5.mp3'),
        g5: new AudioClip('sounds/piano/g5.mp3'),
        a5: new AudioClip('sounds/piano/a5.mp3'),
        b5: new AudioClip('sounds/piano/b5.mp3'),
      },
      blackKeys: {
        cSharp3: new AudioClip('sounds/piano/cSharp3.mp3'),
        dSharp3: new AudioClip('sounds/piano/dSharp3.mp3'),
        fSharp3: new AudioClip('sounds/piano/fSharp3.mp3'),
        gSharp3: new AudioClip('sounds/piano/gSharp3.mp3'),
        aSharp3: new AudioClip('sounds/piano/aSharp3.mp3'),
        cSharp4: new AudioClip('sounds/piano/cSharp4.mp3'),
        dSharp4: new AudioClip('sounds/piano/dSharp4.mp3'),
        fSharp4: new AudioClip('sounds/piano/fSharp4.mp3'),
        gSharp4: new AudioClip('sounds/piano/gSharp4.mp3'),
        aSharp4: new AudioClip('sounds/piano/aSharp4.mp3'),
        cSharp5: new AudioClip('sounds/piano/cSharp5.mp3'),
        dSharp5: new AudioClip('sounds/piano/dSharp5.mp3'),
        fSharp5: new AudioClip('sounds/piano/fSharp5.mp3'),
        gSharp5: new AudioClip('sounds/piano/gSharp5.mp3'),
        aSharp5: new AudioClip('sounds/piano/aSharp5.mp3'),
      },
    },
  },
  models: {
    standard: {
      pianoBase: new GLTFShape('models/piano/pianoBase.glb'),
      muralWall: new GLTFShape('models/mural/muralWall.glb'),
    },
  },
  textures: {
    blank: new Texture('images/ui/blank.png'),
    buttonE: new Texture('images/ui/buttonE.png'),
    buttonF: new Texture('images/ui/buttonF.png'),
    leftClickIcon: new Texture('images/ui/leftClickIcon.png'),
    textPanel: new Texture('images/ui/textPanel.png'),
    nftPanel: new Texture('images/ui/nftPanel.png'),
    closeButton: new Texture('images/ui/closeButton.png'),
    placeholder: new Texture('images/ui/placeholder.png'),
  },
  trigger: {
    triggerShape: new utils.TriggerSphereShape(8, Vector3.Zero()), // Trigger sphere with a radius of 8m
    triggerWhitePianoKey: new utils.TriggerBoxShape(
      new Vector3(0.35, 3, 2),
      new Vector3(0, 0, -1)
    ),
    triggerBlackPianoKey: new utils.TriggerBoxShape(
      new Vector3(0.35, 3, 2),
      Vector3.Zero()
    ),
  },
}