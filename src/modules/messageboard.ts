//import { openMessageBoardUI } from './ui'
import { CheckServer } from './serverHandler'
import { openMessageBoardUI } from './ui'

let SFHeavyFont = new Font(Fonts.SanFrancisco_Heavy)

export enum MessageBoards {
  DISCO = 'disco',
}

let maxCharacters = 20

//// FETCH CURRENT MESSAGES EN MESSAGE BOARDS
//updateMessageBoards()
// how often to refresh scene, in seconds
const messageRefreshInterval: number = 30
// start system
export let serverChecker = new CheckServer(messageRefreshInterval)
engine.addSystem(serverChecker)

const DiscoFloatingText = new Entity()
export let floatingTextShape = new TextShape('Write something')
floatingTextShape.color = Color3.FromHexString('#8040E2')
floatingTextShape.font = SFHeavyFont
DiscoFloatingText.addComponent(floatingTextShape)
DiscoFloatingText.addComponent(
  new Transform({
    position: new Vector3(194.4, 9.75, 297),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(DiscoFloatingText)

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
      openMessageBoardUI(DiscoUIOpener, MessageBoards.DISCO)
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'Write something',
    }
  )
)
engine.addEntity(DiscoUIOpener)

export function setDiscoText(value: string) {
  let shortenedText = value.substr(0, maxCharacters)
  floatingTextShape.value = shortenedText
}

setDiscoText('12324325425654645')

// CURVED LETTERS

// const DiscoFloatingText = new Entity()
// DiscoFloatingText.addComponent(
//   new Transform({
//     position: new Vector3(194.4, 9.75, 283.5),
//     scale: new Vector3(1, 1, 1),
//     rotation: Quaternion.Euler(0, 90, 0),
//   })
// )
// engine.addEntity(DiscoFloatingText)

// let discoLetters: Entity[] = []

// let distanceMultiplier = 16.5

// for (let i = 0; i < maxCharacters; i++) {
//   let angle = (i * 45) / maxCharacters
//   let radAngle = angle * (Math.PI / 90) + 0.785398

//   let letter = new Entity()
//   letter.setParent(DiscoFloatingText)
//   letter.addComponent(new TextShape(''))
//   letter.getComponent(TextShape).fontSize = 22
//   letter.getComponent(TextShape).color = Color3.White() //Color3.Blue()
//   letter.getComponent(TextShape).font = SFHeavyFont
//   letter.addComponent(
//     new Transform({
//       position: new Vector3(
//         Math.sin(radAngle) * distanceMultiplier,
//         0,
//         Math.cos(radAngle) * distanceMultiplier
//       ),
//       rotation: Quaternion.Euler(0, angle - 270, 0),
//     })
//   )
//   engine.addEntity(letter)
//   discoLetters.push(letter)
// }

// export function setDiscoText(text: string) {
//   let shortenedText = text.substr(0, maxCharacters)
//   for (let i = 0; i <= maxCharacters - 1; i++) {
//     let letter = discoLetters[i]
//     let textShape = letter.getComponent(TextShape)

//     if (i < text.length) {
//       textShape.value = shortenedText[i]
//     } else {
//       textShape.value = ''
//     }
//   }
// }

// setDiscoText('123456789012345678901234567890')
