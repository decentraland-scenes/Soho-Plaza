import { VoxelData, messageBoard } from './customTypes'
import {
  updateVoxelJSON,
  updateMuralJSON,
  getMuralJSON,
  getVoxelJSON,
  updateSeqJSON,
  getSeqJSON,
  uploadMessageBoardJSON,
  updateMessageJSON,
} from './awsUpload'

const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: true }))

let awsBaseURL = 'https://soho-plaza.s3.us-east-2.amazonaws.com/'

//// TEST

app.get('/hello-world', (req: any, res: any) => {
  return res.status(200).send('Hello World!')
})

///// MURAL

app.get('/mural', async (req: any, res: any) => {
  let realm = req.query.realm
  let url = awsBaseURL + '/mural/' + realm + '/tiles.json'

  let currentMural: number[] = await getMuralJSON(url)

  return res.status(200).json({ tiles: currentMural })
})

app.post('/update-mural', async (req: any, res: any) => {
  let tiles = req.body.tiles
  let realm = req.query.realm
  updateMuralJSON(tiles, realm)

  return res.status(200).send('Updated Mural')
})

//// VOXEL EDITOR

app.get('/voxels', async (req: any, res: any) => {
  let realm = req.query.realm
  let url = awsBaseURL + '/voxels/' + realm + '/voxels.json'

  let currentVoxels: VoxelData[] = await getVoxelJSON(url)

  return res.status(200).json({ tiles: currentVoxels })
})

app.post('/update-voxels', async (req: any, res: any) => {
  let realm = req.query.realm
  let voxels = req.body.voxels

  updateVoxelJSON(voxels, realm)

  return res.status(200).send('Updated Voxels')
})

app.post('/reset-voxels', async (req: any, res: any) => {
  let realm = req.query.realm
  let tiles: VoxelData[] = []

  updateVoxelJSON(tiles, realm)

  return res.status(200).send('Updated Voxels')
})

/// SEQUENCER

app.get('/sequencer', async (req: any, res: any) => {
  let realm = req.query.realm
  let url = awsBaseURL + '/sequencer/' + realm + '/stones.json'

  let currentSeq: number[][] = await getSeqJSON(url)

  return res.status(200).json({ stones: currentSeq })
})

app.post('/update-sequencer', async (req: any, res: any) => {
  let stones = req.body.stones
  let realm = req.query.realm

  updateSeqJSON(stones, realm)

  return res.status(200).send('Updated Sequencer')
})

/// MESSAGE BOARD

app.post('/create', (req: any, res: any) => {
  let location: string = String(req.query.location)
  let jsonContents: messageBoard = req.body

  uploadMessageBoardJSON(location, jsonContents)
  return res.status(200).send('Created message board')
})

app.post('/addmessage', (req: any, res: any) => {
  let location: string = String(req.query.location)
  let message: string = String(req.query.message)

  let url = awsBaseURL + '/messageboards/' + location + '.json'

  updateMessageJSON(url, message, location)

  return res.status(200).send('updated message board')
})

exports.app = functions.https.onRequest(app)
