import { CharSkin, VoiceType } from "./raw/skin"

export type GeneratedOutfitData = {
  id: string
  dynIllustId: string | null
  avatarId: string
  portraitId: string | null
  voiceId: string | null
  voiceType: VoiceType
}

export type GeneratedOutfitIndexData = {
  id: string
  avatarId: string
  portraitId: string | null
}

export class Outfit {
  id: string
  dynIllustId: string | null
  avatarId: string
  portraitId: string | null
  voiceId: string | null
  voiceType: VoiceType

  public constructor(data: CharSkin) {
    this.id = data.skinId
    this.dynIllustId = data.dynIllustId
    this.avatarId = data.avatarId
    this.portraitId = data.portraitId
    this.voiceId = data.voiceId
    this.voiceType = data.voiceType
  }

  public toData(): GeneratedOutfitData {
    return {
      id: this.id,
      dynIllustId: this.dynIllustId,
      avatarId: this.avatarId,
      portraitId: this.portraitId,
      voiceId: this.voiceId,
      voiceType: this.voiceType,
    }
  }

  public toIndexData(): GeneratedOutfitIndexData {
    return {
      id: this.id,
      avatarId: this.avatarId,
      portraitId: this.portraitId,
    }
  }
}
