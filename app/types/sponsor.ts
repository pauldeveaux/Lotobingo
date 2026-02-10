export interface Sponsor {
  id: number
  name: string
  image: string  // base64 data URL
}

export interface SponsorFormData {
  name: string
  image: string | null
}

export interface SponsorState {
  sponsors: Record<number, Sponsor>
}
