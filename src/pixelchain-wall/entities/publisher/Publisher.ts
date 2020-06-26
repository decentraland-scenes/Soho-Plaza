import { getUserAccount } from "@decentraland/EthereumController"
import * as EthConnect from "../../../../node_modules/eth-connect/esm"
import Abi from "./contracts/PixelChainAbi"
import { getProvider } from "@decentraland/web3-provider"
import { ColorHex } from "../../Global"
import { SwatchIndex } from "../palette/MultiplayerPalette"
import { showMessage } from "../../ui/Modals"

const VALUE = { amount: 0.008, unit: 'ether' }
const CONTRACTS = {
    ropsten: '0xd3f0078f143cf996377ba00b3985de5f73899603',
    mainnet: '0xbc0e164ee423b7800e355b012c06446e28b1a29d',
}

export async function publish(name: string, palette: ColorHex[], wall: SwatchIndex[][]) {
    executeTask(async () => {
        try {
            // create an instance of the web3 provider to interface with Metamask
            const provider = await getProvider()
            // Create the object that will handle the sending and receiving of RPC messages
            const requestManager = new EthConnect.RequestManager(provider)
            // Create a factory object based on the abi
            const factory = new EthConnect.ContractFactory(requestManager, Abi)
            // Calculate contract
            const version = await requestManager.net_version()
            log(version)
            const contractAddress = version == '1' ? CONTRACTS.mainnet : CONTRACTS.ropsten
            // Use the factory object to instance a `contract` object, referencing a specific contract
            const contract = (await factory.at(contractAddress)) as any
            const address = await getUserAccount()
            const _palette = mapPalette(palette)
            const _data = mapWall(wall)
            const txId = await contract.create(name, _data, _palette, { from: address, value: EthConnect.toWei(`${VALUE.amount}`, VALUE.unit) })
            showMessage('TRANSACTION WAS CREATED', 'PLEASE CHECK YOUR WALLET FOR DETAILS', 5000)
        } catch (error) {
            log("ERROR", error.toString())
        }
    })
}

function mapPalette(palette: ColorHex[]): string {
    return '0x' + palette.map(color => color.substring(1))
        .map(color => color.toLowerCase())
        .join('')
}

function mapWall(wall: SwatchIndex[][]): string {
    return '0x' + [].concat(...wall)
        .map(index => EthConnect.toHex(index))
        .map(hex => hex.replace('0x', ''))
        .map(hex => EthConnect.padLeft(hex, 2))
        .join('')
}