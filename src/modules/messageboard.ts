//import { openMessageBoardUI } from './ui'
import { CheckServer } from './serverHandler'

let SFHeavyFont = new Font(Fonts.SanFrancisco_Heavy)

export enum MessageBoards {
  DISCO = 'disco',
}

// DISCO

const DiscoFloatingText = new Entity()
DiscoFloatingText.addComponent(
  new Transform({
    position: new Vector3(194.4, 9.75, 283.5),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 90, 0),
  })
)
engine.addEntity(DiscoFloatingText)

let discoLetters: Entity[] = []

let distanceMultiplier = 16.5
let maxCharacters = 20
for (let i = 0; i < maxCharacters; i++) {
  let angle = (i * 45) / maxCharacters
  let radAngle = angle * (Math.PI / 90) + 0.785398

  let letter = new Entity()
  letter.setParent(DiscoFloatingText)
  letter.addComponent(new TextShape(''))
  letter.getComponent(TextShape).fontSize = 22
  letter.getComponent(TextShape).color = Color3.White() //Color3.Blue()
  letter.getComponent(TextShape).font = SFHeavyFont
  letter.addComponent(
    new Transform({
      position: new Vector3(
        Math.sin(radAngle) * distanceMultiplier,
        0,
        Math.cos(radAngle) * distanceMultiplier
      ),
      rotation: Quaternion.Euler(0, angle - 270, 0),
    })
  )
  engine.addEntity(letter)
  discoLetters.push(letter)
}

let DiscoUIOpener = new Entity()
DiscoUIOpener.addComponent(new GLTFShape('models/disco_message.glb'))
DiscoUIOpener.addComponent(
  new Transform({
    position: new Vector3(182, 0.6, 291),
    scale: new Vector3(1, 1, 1),
  })
)
DiscoUIOpener.addComponent(
  new OnPointerDown(
    (e) => {
      //openMessageBoardUI(TowerUIOpener, MessageBoards.TOWER)
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'Write something',
    }
  )
)
engine.addEntity(DiscoUIOpener)

export function setDiscoText(text: string) {
  let shortenedText = text.substr(0, maxCharacters)
  for (let i = 0; i <= maxCharacters - 1; i++) {
    let letter = discoLetters[i]
    let textShape = letter.getComponent(TextShape)

    if (i < text.length) {
      textShape.value = shortenedText[i]
    } else {
      textShape.value = ''
    }
  }
}

setDiscoText('123456789012345678901234567890')

//// FETCH CURRENT MESSAGES EN MESSAGE BOARDS
//updateMessageBoards()
// how often to refresh scene, in seconds
const messageRefreshInterval: number = 30
// start system
export let serverChecker = new CheckServer(messageRefreshInterval)
engine.addSystem(serverChecker)

/// SIMPLE
// const ArtichokeFloatingText = new Entity()
// export let ArtichokeFloatingTextShape = new TextShape('Write something')
// ArtichokeFloatingTextShape.color = Color3.FromHexString('#8040E2')
// ArtichokeFloatingTextShape.font = SFHeavyFont
// ArtichokeFloatingText.addComponent(ArtichokeFloatingTextShape)
// ArtichokeFloatingText.addComponent(
//   new Transform({
//     position: new Vector3(51, 15.5, 31.7),
//     scale: new Vector3(1, 1, 1),
//     rotation: Quaternion.Euler(0, 180, 0),
//   })
// )
// engine.addEntity(ArtichokeFloatingText)

// ArtichokeFloatingText.getComponent(Transform).rotate(new Vector3(1, 0, 0), -15)

// let ArtichokeUIOpener = new Entity()
// ArtichokeUIOpener.addComponent(new GLTFShape('models/artichoke_message.glb')) // GLTFShape('models/Message.glb'))
// ArtichokeUIOpener.addComponent(
//   new Transform({
//     position: new Vector3(42, 8.4, 43),
//     scale: new Vector3(1, 1, 1),
//   })
// )
// ArtichokeUIOpener.addComponent(
//   new OnPointerDown(
//     (e) => {
//       //openMessageBoardUI(ArtichokeUIOpener, MessageBoards.ARTICHOKE)
//     },
//     {
//       button: ActionButton.PRIMARY,
//       hoverText: 'Write something',
//     }
//   )
// )
// engine.addEntity(ArtichokeUIOpener)
