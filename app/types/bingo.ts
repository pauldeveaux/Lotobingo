// Central type definitions for the bingo application
import type { Sponsor } from './sponsor'
export type { Sponsor } from './sponsor'

export type BingoType = 'Carton plein' | 'Quine' | 'Double quine'

export interface BingoSettings {
  name: string
  type: BingoType
  minNumber: number
  maxNumber: number
}

export interface Bingo {
  id: number
  order: number
  drawnNumbers: number[]
  isFinished: boolean
  settings: BingoSettings
  prizeIds: number[]
}

export interface BingoState {
  lotoName: string
  lotoSubtitle: string
  lotoLogo: string | null
  bingos: Record<number, Bingo>
  currentBingoId: number
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
  type: 'SYNC' | 'SYNC_PRIZE' | 'SYNC_SPONSOR' | 'SYNC_STYLE' | 'REQUEST_SYNC'
  bingo?: Bingo
  lotoName?: string
  lotoSubtitle?: string
  lotoLogo?: string | null
  prize?: Prize | null
  sponsor?: Sponsor | null
  clientStyle?: Record<string, unknown>
}

export interface BingoFormData {
  name: string
  type: BingoType
  maxNumber: number
  prizeIds: number[]
}

// Prize types
export interface Prize {
  id: number
  name: string
  value: number
  photo: string | null
  providerName: string | null
  providerImage: string | null
}

export interface PrizeFormData {
  name: string
  value: number
  photo: string | null
  providerName: string | null
  providerImage: string | null
}

export interface PrizeState {
  prizes: Record<number, Prize>
}
