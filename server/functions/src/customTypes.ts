export type messageBoard = {
  name: string
  messages: string[]
}

export enum Mode {
  Add = 0,
  Subtract = 1,
  EyeDrop = 2,
}

export type VoxelData = {
  x: number
  y: number
  z: number
  colIndex: number
  mode: Mode
}
