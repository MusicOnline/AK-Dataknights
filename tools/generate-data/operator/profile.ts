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
  private title: LocaleString
  private text: LocaleString
  private unlockType: LockType
  private unlockParam: string

  public constructor(data: StoryTextAudio) {
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

  public addLocale(locale: constants.GameLocale, data: StoryTextAudio): void {
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
    this.stories = handbookDict.storyTextAudio.map((story) => new Story(story))
  }

  public static fromDataOrNull(operatorId: string): Profile | null {
    const table =
      globalThis.GAME_TABLES!.HandbookInfo[constants.ORIGINAL_LOCALE]
        .handbookDict
    const handbookDict: HandbookDict | undefined = table[operatorId]
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
    const handbookDict: HandbookDict | undefined = table[this.operatorId]
    if (!handbookDict) return
    this.stories.forEach((story, index) =>
      story.addLocale(locale, handbookDict.storyTextAudio[index]),
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
