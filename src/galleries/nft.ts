export class NFT extends Entity {
  constructor(
    nft: NFTShape,
    transform: Transform,
  ) {
    super()
    engine.addEntity(this)
    this.addComponent(nft)
    this.addComponent(transform)
  }
}