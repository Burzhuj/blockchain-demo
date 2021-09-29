import React from "react"
import {Card, Col, Container, Row} from "react-bootstrap"
import {inject, observer} from "mobx-react"
import Block from "./Block"

@inject("BlockchainStore")

@observer
class Blockchain extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.BlockchainStore.fetchBlockchainData()
  }

  render() {
    const BlockchainStore = this.props.BlockchainStore

    return (
      <Container>
        <Card border="light">
          <Card.Body>
            <Card.Title>Simple Blockchain DEMO (ReactJS + Go)</Card.Title>
          </Card.Body>
        </Card>
        <Row xs={1} md={2} lg={4} className="g-4">
          {BlockchainStore.blockchain.map(function (block, i) {
            return (
              <Col key={i}>
                <Block block={block} i={i}/>
              </Col>
            )
          })}
        </Row>
      </Container>
    )
  }
}

export default Blockchain
