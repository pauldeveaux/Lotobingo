export type CardType = '75-ball' | '90-ball'

export interface Card {
  id: number
  name: string
  type: CardType
  value: (number | null)[][]
}

export interface CardState {
  cards: Record<number, Card>
}
