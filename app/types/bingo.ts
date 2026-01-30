// Central type definitions for the bingo application

export type BingoType = 'Carton plein' | 'Quine' | 'Double quine'

export interface BingoSettings {
  name: string
  type: BingoType
  minNumber: number
  maxNumber: number
}

export interface Bingo {
  id: number
  drawnNumbers: number[]
  isFinished: boolean
  settings: BingoSettings
}

export interface BingoState {
  bingos: Record<number, Bingo>
  currentBingoId: number
  lastId: number | null
}

export interface BallConfig {
  hoverable: boolean
  clickable: boolean
}

export interface Position {
  x: number
  y: number
}

export interface WebSocketMessage {
  type: 'SYNC' | 'REQUEST_SYNC'
  bingo?: Bingo
}

export interface BingoFormData {
  name: string
  type: BingoType
  ballsNumber: number
}
