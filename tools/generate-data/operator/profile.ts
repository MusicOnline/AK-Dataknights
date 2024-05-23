import type {
  HandbookDict,
  LockType,
  StoryTextAudio,
} from "../raw/handbook-info"
import { LocaleString, type LocaleObject, type Localizable } from "../utils"
import * as constants from "../constants"

export type GeneratedOperatorProfileStoryData = {
  unlockType: LockType
  unlockParam: string
}

export class Story implements Localizable {
  private operatorId: string
  private index: number
  private title: LocaleString
  private text: LocaleString
  private unlockType: LockType
  private unlockParam: string

  public constructor(operatorId: string, index: number, data: StoryTextAudio) {
    this.operatorId = operatorId
    this.index = index
    this.title = new LocaleString(data.storyTitle)
    this.text = new LocaleString(data.stories[0].storyText)
    this.unlockType = data.stories[0].unLockType
    this.unlockParam = data.stories[0].unLockParam
  }

  public toData(): GeneratedOperatorProfileStoryData {
    return {
      unlockType: this.unlockType,
      unlockParam: this.unlockParam,
    }
  }

  public addLocale(
    locale: constants.GameLocale,
    dataList: StoryTextAudio[],
  ): void {
    let data: StoryTextAudio | null = null
    if (
      constants.AMIYA_IDS.includes(this.operatorId) &&
      Object.keys(constants.AMIYA_STORY_CN_TO_EJK).includes(
        this.index.toString(),
      )
    ) {
      data = dataList[constants.AMIYA_STORY_CN_TO_EJK[this.index]]
    } else if (!constants.AMIYA_IDS.includes(this.operatorId)) {
      data = dataList[this.index]
    }
    if (!data) return
    this.title.addLocale(locale, data.storyTitle)
    this.text.addLocale(locale, data.stories[0].storyText)
  }

  public addLocaleTL(
    locale: constants.TranslatedLocale,
    data: LocaleObject,
  ): void {
    this.title.addLocaleTL(locale, <string | null | undefined>data.title)
    this.text.addLocaleTL(locale, <string | null | undefined>data.text)
  }

  public toLocaleData(locale: constants.OutputLocale): LocaleObject {
    return {
      title: this.title.toLocaleData(locale),
      text: this.text.toLocaleData(locale),
    }
  }
}

export type GeneratedOperatorProfileData = {
  isCrossoverLimited: boolean
  stories: GeneratedOperatorProfileStoryData[]
}

export class Profile implements Localizable {
  private operatorId: string
  private isCrossoverLimited: boolean
  private stories: Story[]

  public constructor(operatorId: string, handbookDict: HandbookDict) {
    this.operatorId = operatorId
    this.isCrossoverLimited = handbookDict.isLimited
    this.stories = handbookDict.storyTextAudio.flatMap((story, index) => {
      if (
        constants.AMIYA_IDS.includes(operatorId) &&
        story.stories[0].patchIdList &&
        !story.stories[0].patchIdList.includes(operatorId)
      )
        return []
      return new Story(operatorId, index, story)
    })
  }

  public static fromDataOrNull(operatorId: string): Profile | null {
    const table =
      globalThis.GAME_TABLES!.HandbookInfo[constants.ORIGINAL_LOCALE]
        .handbookDict
    let handbookDict: HandbookDict | undefined = undefined
    if (constants.AMIYA_IDS.includes(operatorId)) {
      handbookDict = table[constants.AMIYA_IDS[0]]
    } else {
      handbookDict = table[operatorId]
    }
    if (!handbookDict) return null
    return new Profile(operatorId, handbookDict)
  }

  public toData(): GeneratedOperatorProfileData {
    return {
      isCrossoverLimited: this.isCrossoverLimited,
      stories: this.stories.map((story) => story.toData()),
    }
  }

  public addLocale(locale: constants.GameLocale): void {
    const table = globalThis.GAME_TABLES!.HandbookInfo[locale].handbookDict
    let handbookDict: HandbookDict | undefined = undefined
    if (constants.AMIYA_IDS.includes(this.operatorId)) {
      handbookDict = table[constants.AMIYA_IDS[0]]
    } else {
      handbookDict = table[this.operatorId]
    }
    if (!handbookDict) return
    this.stories.forEach((story) =>
      story.addLocale(locale, handbookDict.storyTextAudio),
    )
  }

  public addLocaleTL(
    locale: constants.TranslatedLocale,
    data: LocaleObject,
  ): void {
    this.stories.forEach((story, index) => {
      if ((<LocaleObject>(<LocaleObject>data)?.stories)?.[index])
        story.addLocaleTL(
          locale,
          <LocaleObject>(<LocaleObject>data.stories)[index],
        )
    })
  }

  public toLocaleData(locale: constants.OutputLocale): LocaleObject {
    const stories = this.stories.reduce(
      (accumulator: LocaleObject, current, index) => {
        accumulator[index] = current.toLocaleData(locale)
        return accumulator
      },
      {},
    )
    return { stories }
  }
}
