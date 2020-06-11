import { seqNumbers } from './stones'
import { awsServer, fireBaseServer } from '../modules/serverHandler'
import { playerRealm, setRealm } from '../modules/realmData'
import utils from '../../node_modules/decentraland-ecs-utils/index'

// get latest sequencer state stored in server
export async function getStones(): Promise<number[][]> {
  try {
    if (!playerRealm) {
      await setRealm()
    }
    let url = awsServer + 'sequencer/' + playerRealm + '/stones.json'
    log('url used ', url)
    let response = await fetch(url)
    let json = await response.json()
    return json.stones
  } catch {
    log('error fetching from AWS server')
  }
}

// change data in sequencer
export async function changeSequencer() {
  if (!playerRealm) {
    await setRealm()
  }
  seqChanger.addComponentOrReplace(
    // Only send request if no more changes come over the next second
    new utils.Delay(1000, async function () {
      try {
        let url = fireBaseServer + 'update-sequencer?realm=' + playerRealm
        let body = JSON.stringify({ stones: seqNumbers })
        let response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
        })
        return response.json()
      } catch {
        log('error fetching from AWS server')
      }
    })
  )
}

// dummy entity to throttle the sending of change requests
let seqChanger = new Entity()
engine.addEntity(seqChanger)
