import { getUserAccount } from '@decentraland/EthereumController'

let userData: string

export async function fetchUserData() {
  try {
    const address = await getUserAccount()
    log(address)
    return address
  } catch (error) {
    log(error.toString())
  }
}

export async function setUserData() {
  try {
    userData = await getUserAccount()
    log(userData)
  } catch (error) {
    log(error.toString())
  }
}
