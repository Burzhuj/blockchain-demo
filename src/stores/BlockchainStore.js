import {action, makeAutoObservable, observable} from "mobx"
import hmacSHA256 from "crypto-js/hmac-sha256"
import Config from "Config"

export default class BlockchainStore {

  @observable blockchain = []

  constructor() {
    makeAutoObservable(this)
  }

  @action bindFieldData(i, name, value) {
    const block = this.blockchain[i]
    if (name === "nonce") {
      block[name] = parseInt(value)
    } else {
      block[name] = value
    }

    const newHash = hmacSHA256(block.id + block.data + block.prev + block.nonce, "secret").toString()

    if (newHash !== block.hash) {
      const blockchain = this.blockchain
      block.hash = newHash
      for (let i1 = i; i1 < blockchain.length; i1++) {
        const nextBlock = blockchain[i1]
        if (i1 !== 0) {
          nextBlock.prev = blockchain[i1 - 1].hash
        }
        nextBlock.hash = hmacSHA256(nextBlock.id + nextBlock.data + nextBlock.prev + nextBlock.nonce, "secret").toString()
        nextBlock.valid = nextBlock.hash.startsWith("0000")
      }
    }
  };

  @action bindBlockchainData(data) {
    this.blockchain = data
  };

  @action bindMinedData(i, data) {
    this.bindFieldData(i, "nonce", data.nonce)
    this.bindFieldData(i, "hash", data.hash)
  };

  @action fetchBlockchainData = () => {
    fetch(Config.api.url + Config.api.endpoint.blockchain.get)
      .then((res) => res.json())
      .then((blockchain) => {
        this.bindBlockchainData(blockchain)
      })
  }

  @action mineBlock = async (i) => {
    const res = await fetch(Config.api.url + Config.api.endpoint.blockchain.mine, {
      method: "POST",
      body: JSON.stringify(this.blockchain[i])
    })
    return await res.json()
  }
}
