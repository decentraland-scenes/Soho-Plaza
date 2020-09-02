import { data } from './data'
import { NFT } from './nft'

export function addNFTs(): void {
  // Sound entities
  const moreInfoSound = new Entity()
  moreInfoSound.addComponent(new Transform())

  moreInfoSound.addComponent(
    new AudioSource(new AudioClip('sounds/navigationForward.mp3'))
  )
  engine.addEntity(moreInfoSound)
  moreInfoSound.setParent(Attachable.PLAYER)

  /// --- NFTs ---
  //This is how the frames enum will look like.
  //Classic being the keyword for the picture frame we are using right now
  enum PictureFrameStyle {
    Classic = 0,
    Baroque_Ornament,
    Diamond_Ornament,
    Minimal_Wide,
    Minimal_Grey,
    Blocky,
    Gold_Edges,
    Gold_Carved,
    Gold_Wide,
    Gold_Rounded,
    Metal_Medium,
    Metal_Wide,
    Metal_Slim,
    Metal_Rounded,
    Pins,
    Minimal_Black,
    Minimal_White,
    Tape,
    Wood_Slim,
    Wood_Wide,
    Wood_Twigs,
    Canvas,
  }

  // Number of objects in the json file
  let count = Object.keys(data).length

  for (let i = 0; i < count; i++) {
    const picture = new NFT(
      new NFTShape(
        'ethereum://' + data[i].contract_address + '/' + data[i].token_id,
        { style: data[i].style, color: data[i].color }
      ),
      new Transform({
        position: new Vector3(
          data[i].transform.position.x,
          data[i].transform.position.y,
          data[i].transform.position.z
        ),
        rotation: Quaternion.Euler(
          data[i].transform.rotation.x,
          data[i].transform.rotation.y,
          data[i].transform.rotation.z
        ),
        scale: new Vector3(
          data[i].transform.scale.x,
          data[i].transform.scale.y,
          data[i].transform.scale.z
        ),
      })
    )

    picture.addComponent(
      new OnPointerDown(
        () => {
          openNFTDialog(
            'ethereum://' + data[i].contract_address + '/' + data[i].token_id
          )
          // openExternalURL(data[i].link)
          moreInfoSound.getComponent(AudioSource).playOnce()
        },
        {
          button: ActionButton.ANY,
          showFeedback: true,
          hoverText: 'More Info',
          distance: 30,
        }
      )
    )
  }
}
