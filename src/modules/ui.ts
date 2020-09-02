import { setNewMessage } from './serverHandler'

import { MessageBoards } from './messageboard'
//import { Audio } from '../voxels/modules/audio'

export const screenSpaceUI = new UICanvas()
screenSpaceUI.visible = true

export var UIOpenTime = 0

export var UIOpener: Entity

// Open dialog sound
export const openDialogSound = new Entity()
openDialogSound.addComponent(new Transform())
// This seems to work even when the player moves as oppose to getting the transform from the item
// as the items transform might not be matching their position visuallly
openDialogSound.addComponent(
  new AudioSource(new AudioClip('sounds/navigationForward.mp3'))
)
engine.addEntity(openDialogSound)
openDialogSound.setParent(Attachable.PLAYER)

// Close dialog sound
export const closeDialogSound = new Entity()
closeDialogSound.addComponent(new Transform())
closeDialogSound.addComponent(
  new AudioSource(new AudioClip('sounds/navigationBackward.mp3'))
)
engine.addEntity(closeDialogSound)
closeDialogSound.setParent(Attachable.PLAYER)

export function closeUI(npc?: boolean) {
  messagebg.visible = false
}

export function checkUIOpen(): boolean {
  if (messagebg.visible) {
    return true
  } else {
    return false
  }
}

export function updateOpenUITime() {
  UIOpenTime = +Date.now()
}

export function setUiOpener(ent: Entity) {
  UIOpener = ent
}

let SFFont = new Font(Fonts.SanFrancisco)

let SFHeavyFont = new Font(Fonts.SanFrancisco_Heavy)

////////  MESSAGE BOARD

const messageBoardTexture = new Texture('images/inputText.png')

export let messagebg = new UIImage(screenSpaceUI, messageBoardTexture)
messagebg.visible = false

export function openMessageBoardUI(
  opener: Entity,
  boardLocation: MessageBoards
) {
  updateOpenUITime()
  messagebg.visible = false
  UIOpener = opener
  openDialogSound.getComponent(AudioSource).playOnce()

  messagebg = new UIImage(screenSpaceUI, messageBoardTexture)
  messagebg.name = 'mmbBackground'
  messagebg.width = 998
  messagebg.height = 261
  messagebg.hAlign = 'center'
  messagebg.vAlign = 'center'
  messagebg.sourceLeft = 13
  messagebg.sourceTop = 0
  messagebg.sourceWidth = 998
  messagebg.sourceHeight = 261
  messagebg.visible = true

  const message = new UIInputText(messagebg)
  message.name = 'mbMessage'
  message.width = '677px'
  message.height = '74'
  message.hAlign = 'center'
  message.vAlign = 'center'
  message.positionY = 130.5 - 129 - 37
  message.fontSize = 30
  message.vTextAlign = 'center'
  message.hTextAlign = 'center'
  message.color = Color4.FromHexString('#53508F88')
  message.placeholder = 'Write something'

  message.isPointerBlocker = true
  message.visible = true
  message.onTextSubmit = new OnTextSubmit((x) => {
    let newText = x.text.substr(0, 50)
    setNewMessage(boardLocation, newText)
    openMessageBoardConfirmation(opener)
  })
}

export function openMessageBoardConfirmation(opener: Entity) {
  updateOpenUITime()
  messagebg.visible = false
  UIOpener = opener
  openDialogSound.getComponent(AudioSource).playOnce()

  messagebg = new UIImage(screenSpaceUI, messageBoardTexture)
  messagebg.name = 'mmbBackground'
  messagebg.width = 848
  messagebg.height = 177
  messagebg.hAlign = 'center'
  messagebg.vAlign = 'center'
  messagebg.sourceLeft = 78
  messagebg.sourceTop = 323
  messagebg.sourceWidth = 848
  messagebg.sourceHeight = 177
  messagebg.visible = true
}

/////// CLOSE UI

const allUIImages = engine.getComponentGroup(UIImage)

// Instance the input object
const input = Input.instance

//button down event
input.subscribe('BUTTON_DOWN', ActionButton.POINTER, false, (e) => {
  const currentTime = +Date.now()

  // Won't close the UI if it was just opened
  if (checkUIOpen() && currentTime - UIOpenTime > 100) {
    closeUI()
  }
})

// class UIDistanceSystem implements ISystem {
//   update() {
//     if (checkUIOpen()) {
//       let dist = distance(
//         Camera.instance.position,
//         UIOpener.getComponent(Transform).position
//       )

//       // if player walks too far from entity
//       if (dist > 8 * 8) {
//         // close all UIs, including NPC
//         closeUI(true)
//       }
//     }
//   }
// }

// engine.addSystem(new UIDistanceSystem())

// Get distance
/* 
Note:
This function really returns distance squared, as it's a lot more efficient to calculate.
The square root operation is expensive and isn't really necessary if we compare the result to squared values.
We also use {x,z} not {x,y}. The y-coordinate is how high up it is.
*/
function distance(pos1: Vector3, pos2: Vector3): number {
  const a = pos1.x - pos2.x
  const b = pos1.z - pos2.z
  return a * a + b * b
}
