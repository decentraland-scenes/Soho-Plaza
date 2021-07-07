export let invisibleMaterial = new Material()
invisibleMaterial.albedoColor = new Color4(0, 0, 0, 0)
invisibleMaterial.alphaTest = 1

export class ExternalLink extends Entity {
  constructor(
    transform: TransformConstructorArgs,
    link: string,
    onHover: string,
    testMode?: boolean
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new Transform(transform))

    this.addComponent(new BoxShape())

    if (!testMode) {
      this.addComponent(invisibleMaterial)
    }

    this.addComponent(
      new OnPointerDown(
        (e) => {
          openExternalURL(link)
        },
        { button: ActionButton.PRIMARY, hoverText: onHover }
      )
    )
  }
}

export function addLinks() {
  let ethermon = new ExternalLink(
    { position: new Vector3(269, 1.7, 18), scale: new Vector3(7, 6, 7) },
    'https://ethermon.io/',
    'Visit site'
    //true
  )

  let battleracers = new ExternalLink(
    { position: new Vector3(307, 1.7, 51), scale: new Vector3(6, 4, 5) },
    'https://battleracers.io/',
    'Visit site'
    //true
  )

  let cryptoKitties = new ExternalLink(
    { position: new Vector3(304, 1.7, 71.5), scale: new Vector3(5, 4.5, 5.5) },
    'https://www.cryptokitties.co/',
    'Visit site'
    //true
  )

  let axie = new ExternalLink(
    { position: new Vector3(307, 1.7, 88.5), scale: new Vector3(5, 4, 6) },
    'https://axieinfinity.com/',
    'Visit site'
    // true
  )

  let cryptomotors = new ExternalLink(
    { position: new Vector3(306.6, 1.7, 105.7), scale: new Vector3(6, 4, 6) },
    'https://www.cryptomotors.io/',
    'Visit site'
    //true
  )
}
