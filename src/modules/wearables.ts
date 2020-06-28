import * as cryptoUtils from '../../node_modules/decentraland-crypto-utils/avatar/index'

export async function checkWearableCategory(category: Category) {
  let wearablesList = await getListOfWearables()
  let equipped = await cryptoUtils.equipedItems()

  log(wearablesList, equipped)

  for (let item of equipped) {
    for (let wearablesCollection of wearablesList) {
      for (let wearable of wearablesCollection.wearables) {
        if (item === wearable.id) {
          if (wearable.category == category) {
            log('found matching wearable! ', item)
            return true
          } else {
            continue
          }
        }
      }
    }
  }
  log('no matching wearables')
  return false
}

export enum Category {
  BodyShape = 'body_shape',
  Earring = 'earring',
  Empty = '',
  Eyebrows = 'eyebrows',
  Eyes = 'eyes',
  Eyewear = 'eyewear',
  FacialHair = 'facial_hair',
  Feet = 'feet',
  Hair = 'hair',
  Hat = 'hat',
  Head = 'head',
  Helmet = 'helmet',
  LowerBody = 'lower_body',
  Mask = 'mask',
  Mouth = 'mouth',
  Tiara = 'tiara',
  TopHead = 'top_head',
  UpperBody = 'upper_body',
}

export enum Rarity {
  Epic = 'epic',
  Legendary = 'legendary',
  Mythic = 'mythic',
  Rare = 'rare',
  Uncommon = 'uncommon',
}

export interface Wearables {
  id: string
  wearables: Wearable[]
}

export interface Wearable {
  id: string
  representations: Representation[]
  type: Type
  category: Category
  tags: string[]
  baseUrl: string
  i18n: I18N[]
  thumbnail: string
  image: string
  replaces?: Category[]
  hides?: Category[]
  description?: string
  rarity?: Rarity
}

export interface I18N {
  code: Code
  text: string
}

export enum Code {
  En = 'en',
  Es = 'es',
}

export interface Representation {
  bodyShapes: BodyShape[]
  mainFile: string
  contents: Content[]
  overrideReplaces?: any[]
  overrideHides?: any[]
}

export enum BodyShape {
  Basefemale = 'Basefemale',
  DCLBaseAvatarsBaseFemale = 'dcl://base-avatars/BaseFemale',
  DCLBaseAvatarsBaseMale = 'dcl://base-avatars/BaseMale',
}

export interface Content {
  file: string
  hash: string
}

export enum Type {
  Wearable = 'wearable',
}

export async function getListOfWearables() {
  return (await fetch(
    'https://wearable-api.decentraland.org/v2/collections'
  ).then((res) => res.json())) as Wearables[]
}
