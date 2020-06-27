import { MessageBoards, serverChecker, setDiscoText } from './messageboard'

export const sceneMessageBus = new MessageBus()

export let awsServer = 'https://soho-plaza.s3.us-east-2.amazonaws.com/'
export let fireBaseServer =
  'https://us-central1-soho-plaza.cloudfunctions.net/app/'

// check server for new messageboard messages
export class CheckServer implements ISystem {
  messageTimer: number
  totalMessageTime: number
  eventTimer: number
  totalEventTimer: number
  constructor(messageTimer: number) {
    this.totalMessageTime = messageTimer
    this.messageTimer = 5
    this.eventTimer = 0

    this.totalEventTimer = 2
  }
  update(dt: number) {
    this.messageTimer -= dt
    //this.eventTimer += dt

    if (this.messageTimer < 0) {
      this.messageTimer += this.totalMessageTime
      updateMessageBoards()
    }
    // if (this.eventTimer > this.totalEventTimer) {
    //   this.eventTimer = 0

    //   checkEventServer()
    // }
  }
}

//////// SEND NEW MESSAGEBOARD MESSSAGE TO SERVER

export async function setNewMessage(location: MessageBoards, message: string) {
  try {
    let trimmedMessage: string
    log('location: ', location, 'message: ', message)

    if (location == MessageBoards.DISCO) {
      trimmedMessage = message.substr(0, 20)
      sceneMessageBus.emit('discoMessage', { text: trimmedMessage })
    }
    // } else if (location === MessageBoards.TOWER) {
    //   log('new message from tower')
    //   trimmedMessage = message.substr(0, 40 - 3)
    //   sceneMessageBus.emit('towerMessage', { text: trimmedMessage })
    //   //setTowerText(newText)
    // }

    let url =
      fireBaseServer +
      'addmessage/?location=' +
      location +
      '&message=' +
      trimmedMessage
    log('new message ', url)
    fetch(url, { method: 'POST' })

    serverChecker.messageTimer = serverChecker.totalMessageTime
  } catch {
    log('error sending to firebase server')
  }
}

// ////// UPDATE MESSAGEBOARDS

// get lastest message
export async function getLastMessage(location: string): Promise<string> {
  try {
    let url = awsServer + 'messageboards/' + location + '.json'
    let response = await fetch(url).then()
    let json = await response.json()
    return json.messages[json.messages.length - 1]
  } catch {
    log('error fetching from AWS server')
  }
}

// change text displayed in the plaza
export async function updateMessageBoards() {
  //log('checking boards')
  let discoMessage = await getLastMessage('disco')
  //log('setting Artichoke message : ', discoMessage)
  if (discoMessage) {
    setDiscoText(discoMessage)
  }
}

///// HANDLE MESSAGEBUS UPDATES

sceneMessageBus.on('discoMessage', (e) => {
  setDiscoText(e.text)
})

// sceneMessageBus.on('artichokeMessage', (e) => {
//   ArtichokeFloatingTextShape.value = e.text
// })
