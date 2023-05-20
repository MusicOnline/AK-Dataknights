export type BattleSkin = {
  overwritePrefab: boolean
  skinOrPrefabId: string | null
}

export type DisplaySkin = {
  skinName: string | null
  colorList: string[] | null
  titleList: string[] | null
  modelName: string | null
  drawerName: string | null
  skinGroupId: string | null
  skinGroupName: string | null
  skinGroupSortIndex: number
  content: string | null
  dialog: string | null
  usage: string | null
  description: string | null
  obtainApproach: string | null
  sortId: number
  displayTagId: string | null
  getTime: number
  onYear: number
  onPeriod: number
}

export type TokenSkinMap = {
  tokenId: string
  tokenSkinId: string
}

export enum VoiceType {
  All = "ALL",
  Illust = "ILLUST",
  None = "NONE",
}

export type SkinTableCharSkinData = {
  // skin-table.json
  skinId: string
  charId: string
  tokenSkinMap: TokenSkinMap[] | null
  illustId: string | null
  dynIllustId: string | null // For dynamic outfits in store and of limited E2
  avatarId: string // Square icon in deployment menu in combat
  portraitId: string | null // Rectangular crop in squad menu; Full splash (Aceship)
  dynPortraitId: string | null // Only for dynamic outfits in store (not limited E2)
  dynEntranceId: string | null
  buildingId: string | null
  battleSkin: BattleSkin
  isBuySkin: boolean
  tmplId: string | null
  voiceId: string | null
  voiceType: VoiceType
  displaySkin: DisplaySkin
}

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

  public constructor(data: SkinTableCharSkinData) {
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
