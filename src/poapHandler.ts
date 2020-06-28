import * as eth from '../node_modules/eth-connect/esm'
import * as EthereumController from '@decentraland/EthereumController'
import { getProvider } from '@decentraland/web3-provider'
import poapContract from './abis/PoapDelegateMint'
import { userData } from './guestbook'
import { setUserData } from './userAccuount'

export let ethController = EthereumController

export let fireBaseServer =
  'https://us-central1-decentraland-events.cloudfunctions.net/app/'

type eventData = {
  secret: string
  event_id: string
}

type signedEventData = {
  signed_message: string
  event_id: string
}

let qrHex: string

let secret: eventData

let signature: signedEventData

export async function callQRAPI(event: string) {
  const url = fireBaseServer + 'get-poap-code/?event=' + event
  try {
    let response = await fetch(url)
    let data = await response.json()
    log('TOKEN: ', data.token)
    return data.token.toString()
  } catch {
    log('error fetching from token server ', url)
  }
}

export async function getSecret(qrHex: string) {
  const url = 'https://api.poap.xyz/actions/claim-qr?qr_hash=' + qrHex

  try {
    let response = await fetch(url)
    let data = await response.json()
    let json: eventData = { secret: data.secret, event_id: data.event_id }
    log('secret :', json)
    return json
  } catch {
    log('error fetching from POAP server ', url)
  }
}

export async function getSignedMessage(data: eventData, qrHex: string) {
  const url = 'https://api.poap.xyz/actions/claim-qr'
  let method = 'POST'
  let headers = { 'Content-Type': 'application/json' }
  let body = JSON.stringify({
    address: userData,
    delegated: true,
    qr_hash: qrHex,
    secret: data.secret,
  })
  log('sending ', body)

  try {
    let response = await fetch(url, {
      headers: headers,
      method: method,
      body: body,
    })
    let data = await response.json()
    let json: signedEventData = {
      signed_message: data.delegated_signed_message,
      event_id: data.event_id,
    }
    return json
  } catch {
    log('error fetching from POAP server ', url)
  }
}

export async function makeTransaction(event: string) {
  await setUserData()
  if (!userData) {
    log('no wallet')
    return
  }
  if (!qrHex) {
    qrHex = await callQRAPI(event)
  }

  if (!secret) {
    secret = await getSecret(qrHex)
  }

  if (!signature) {
    signature = await getSignedMessage(secret, qrHex)
  }

  log('signature for request ', signature)

  const provider = await getProvider()
  const rm = new eth.RequestManager(provider)

  const poapTokenFactory = await new eth.ContractFactory(rm, poapContract)
  const PoapDelegatedMint = (await poapTokenFactory.at(
    //ropsten
    //'0x2f3c23b50396EcB55C73956B069CF04e493bdEf9'
    //mainnet
    '0xAac2497174f2Ec4069A98375A67D798db8a05337'
  )) as any

  await PoapDelegatedMint.mintToken(
    signature.event_id,
    userData,
    signature.signed_message,
    {
      from: userData,
    }
  ).then()

  return
}
