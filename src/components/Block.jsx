import React from "react"
import {Button, Card, FormControl, InputGroup} from "react-bootstrap"
import {inject, observer} from "mobx-react"

@inject("BlockchainStore")

@observer
class Block extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMining: false,
    }

    this.mine = this.mine.bind(this)
  }

  mine() {
    const BlockchainStore = this.props.BlockchainStore
    const i = this.props.i

    this.setState({isMining: true}, async () => {
      const minedBlock = await BlockchainStore.mineBlock(i)
      BlockchainStore.bindMinedData(i, minedBlock)
      this.setState({isMining: false})
    })
  }

  render() {
    const block = this.props.block
    const BlockchainStore = this.props.BlockchainStore

    return (
      <Card style={block.valid ? {} : {backgroundColor: "#ffb8b8"}}>
        <Card.Body>
          <Card.Title>Block #{block.id}</Card.Title>
          <InputGroup className="mb-2" size="sm">
            <InputGroup.Text sm="4" column="sm">Nonce</InputGroup.Text>
            <FormControl placeholder="Nonce"
                         size="sm"
                         value={block.nonce}
                         onChange={(e) => BlockchainStore.bindFieldData(this.props.i, "nonce", e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2" size="sm">
            <InputGroup.Text>Data</InputGroup.Text>
            <FormControl as="textarea"
                         aria-label="With textarea"
                         value={block.data}
                         onChange={(e) => BlockchainStore.bindFieldData(this.props.i, "data", e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2" size="sm">
            <InputGroup.Text sm="4" column="sm">Prev</InputGroup.Text>
            <FormControl placeholder="Prev"
                         size="sm"
                         value={block.prev}
                         onChange={(e) => BlockchainStore.bindFieldData(this.props.i, "prev", e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2" size="sm">
            <InputGroup.Text sm="4" column="sm">Hash</InputGroup.Text>
            <FormControl placeholder="Hash"
                         size="sm"
                         readOnly
                         value={block.hash}
            />
          </InputGroup>
          <Button onClick={this.mine}
                  disabled={this.state.isMining}
          >{ this.state.isMining ? "Mining ..." : "Mine" }</Button>
        </Card.Body>
      </Card>
    )
  }
}

export default Block
