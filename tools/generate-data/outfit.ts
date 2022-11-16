export interface BattleSkin {
  overwritePrefab: boolean;
  skinOrPrefabId: string | null;
}

export interface DisplaySkin {
  skinName: string | null;
  colorList: string[] | null;
  titleList: string[] | null;
  modelName: string | null;
  drawerName: string | null;
  skinGroupId: string | null;
  skinGroupName: string | null;
  skinGroupSortIndex: number;
  content: string | null;
  dialog: string | null;
  usage: string | null;
  description: string | null;
  obtainApproach: string | null;
  sortId: number;
  displayTagId: string | null;
  getTime: number;
  onYear: number;
  onPeriod: number;
}

export interface TokenSkinMap {
  tokenId: string;
  tokenSkinId: string;
}

export enum VoiceType {
  All = "ALL",
  Illust = "ILLUST",
  None = "NONE",
}

export interface SkinTableSkinData {
  // skin-table.json
  skinId: string;
  charId: string;
  tokenSkinMap: TokenSkinMap[] | null;
  illustId: string | null;
  dynIllustId: string | null;
  avatarId: string;
  portraitId: string | null;
  dynPortraitId: string | null;
  dynEntranceId: string | null;
  buildingId: string | null;
  battleSkin: BattleSkin;
  isBuySkin: boolean;
  tmplId: string | null;
  voiceId: string | null;
  voiceType: keyof typeof VoiceType;
  displaySkin: DisplaySkin;
}

export class Outfit {
  id: string;
  dynIllustId: string | null;
  avatarId: string;
  voiceId: string | null;
  voiceType: VoiceType;

  public constructor(data: SkinTableSkinData) {
    this.id = data.skinId;
    this.dynIllustId = data.dynIllustId;
    this.avatarId = data.avatarId;
    this.voiceId = data.voiceId;
    this.voiceType = VoiceType[data.voiceType];
  }
}
