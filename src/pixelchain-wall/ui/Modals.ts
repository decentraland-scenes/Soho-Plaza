import { setTimeout } from "../Utils"

const CANVAS = new UICanvas()

const LOGO_TEXTURE = new Texture("images/logo.png")
const CLOSE_TEXTURE = new Texture("images/close.png")

const container = new UIContainerRect(CANVAS)
container.visible = false
container.width = 400
container.height = 100
container.color = Color4.FromInts(30, 33, 50, 255)
container.isPointerBlocker = true

const logo = new UIImage(container, LOGO_TEXTURE)
logo.positionX = 10
logo.positionY = -10
logo.vAlign = 'top'
logo.hAlign = 'left'
logo.sourceLeft = 0
logo.sourceTop = 0
logo.sourceWidth = 80
logo.sourceHeight = 80
logo.width = 40
logo.height = 40

const close = new UIImage(container, CLOSE_TEXTURE)
close.vAlign = 'top'
close.hAlign = 'right'
close.sourceLeft = 0
close.sourceTop = 0
close.sourceWidth = 305
close.sourceHeight = 305
close.positionX = -10
close.positionY = -15
close.width = 25
close.height = close.width
close.onClick = new OnClick(() => container.visible = false)
close.isPointerBlocker = true

const title = new UIText(container)
title.value = "PLEASE INSERT A COLOR (HEX)"
title.positionX = -85
title.positionY = 38
title.fontSize = 18

const inputName = new UIText(container)
inputName.value = "COLOR:"
inputName.positionX = -140
inputName.positionY = -8
inputName.fontSize = 15

const messageText = new UIText(container)
messageText.value = "COLOR:"
messageText.positionY = -8
messageText.fontSize = 15
messageText.hTextAlign = 'center'

const textInput = new UIInputText(container)
textInput.width = "280px"
textInput.height = "35px"
textInput.fontSize = 30
textInput.positionY = -22
textInput.positionX = 30
textInput.color = Color4.White()

export function showInput(titleText: string, inputNameText: string, placeHolder: string, onTextSubmit: (text: string) => void): void {
    container.visible = true
    messageText.visible = false
    title.value = titleText.toUpperCase()
    inputName.visible = true
    inputName.value = inputNameText.toUpperCase()
    textInput.visible = true
    textInput.placeholder = placeHolder
    textInput.isPointerBlocker = true
    textInput.onTextSubmit = new OnTextSubmit(({ text }) => {
        container.visible = false
        onTextSubmit(text.toUpperCase())
    })
}

export function showMessage(titleText: string, text: string, delay: number) {
    container.visible = true
    messageText.visible = true
    messageText.value = text.toUpperCase()
    inputName.visible = false
    textInput.visible = false
    title.value = titleText.toUpperCase()
    setTimeout(delay, () => {
        container.visible = false
    })
}