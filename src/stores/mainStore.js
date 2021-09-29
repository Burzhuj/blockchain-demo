import BlockchainStore from "./BlockchainStore"

class mainStore {
  constructor() {
    this.BlockchainStore = new BlockchainStore()
  }
}

export default new mainStore()
